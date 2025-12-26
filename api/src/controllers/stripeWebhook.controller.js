// api/src/controllers/stripeWebhook.controller.js
import Stripe from "stripe";
import { getConnection } from "../config/database.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

function safeJson(v, fallback = null) {
  try {
    return JSON.stringify(v ?? fallback);
  } catch {
    return JSON.stringify(fallback);
  }
}

/**
 * Requires table:
 * CREATE TABLE IF NOT EXISTS stripe_events(
 *   id VARCHAR(100) PRIMARY KEY,
 *   type VARCHAR(120) NOT NULL,
 *   payload_json JSON NULL,
 *   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 * ) ENGINE=InnoDB;
 */
async function alreadyProcessed(connection, eventId) {
  const [rows] = await connection.execute(
    `SELECT id FROM stripe_events WHERE id = ? LIMIT 1`,
    [eventId]
  );
  return Array.isArray(rows) && rows.length > 0;
}

async function markProcessed(connection, event) {
  await connection.execute(
    `INSERT INTO stripe_events (id, type, payload_json, created_at) VALUES (?, ?, ?, NOW())`,
    [event.id, event.type, safeJson(event)]
  );
}

/** Lookup order by payment intent in YOUR schema (order_payments table) */
async function findOrderByPaymentIntent(connection, paymentIntentId) {
  const [rows] = await connection.execute(
    `
    SELECT o.*
    FROM orders o
    INNER JOIN order_payments op ON op.order_id = o.id
    WHERE op.stripe_payment_intent_id = ?
    LIMIT 1
    `,
    [paymentIntentId]
  );
  return rows?.[0] ?? null;
}

/** Mark order paid (YOUR enums) + update payment row */
async function markOrderPaid(connection, { orderId, paymentIntentId, chargeId }) {
  // 1) Update order status
  await connection.execute(
    `
    UPDATE orders
    SET status = 'paid',
        updated_at = NOW()
    WHERE id = ?
    `,
    [orderId]
  );

  // 2) Update payment status
  await connection.execute(
    `
    UPDATE order_payments
    SET status = 'succeeded',
        stripe_payment_intent_id = COALESCE(?, stripe_payment_intent_id),
        stripe_charge_id = COALESCE(?, stripe_charge_id),
        updated_at = NOW()
    WHERE order_id = ?
    `,
    [paymentIntentId ?? null, chargeId ?? null, orderId]
  );
}

/** Optional: update order_addresses with Stripe provided details (your columns) */
async function upsertOrderAddressFromSession(connection, orderId, session) {
  const email = session?.customer_details?.email ?? null;
  const phone = session?.customer_details?.phone ?? null;

  const shipping = session?.shipping_details ?? null;
  const addr = shipping?.address ?? null;

  if (!email && !phone && !addr && !shipping?.name) return;

  // order_addresses has UNIQUE(order_id) so ON DUPLICATE KEY works
  await connection.execute(
    `
    INSERT INTO order_addresses
      (order_id, full_name, email, phone, country, city, postal_code, address1, address2, created_at, updated_at)
    VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    ON DUPLICATE KEY UPDATE
      full_name = VALUES(full_name),
      email = VALUES(email),
      phone = VALUES(phone),
      country = VALUES(country),
      city = VALUES(city),
      postal_code = VALUES(postal_code),
      address1 = VALUES(address1),
      address2 = VALUES(address2),
      updated_at = NOW()
    `,
    [
      orderId,
      shipping?.name ?? null,
      email,
      phone,
      addr?.country ?? null,
      addr?.city ?? null,
      addr?.postal_code ?? null,
      addr?.line1 ?? null, // Stripe uses line1/line2 in payload
      addr?.line2 ?? null,
    ]
  );
}

async function handleCheckoutSessionCompleted(connection, session) {
  const paymentIntentId = session?.payment_intent ? String(session.payment_intent) : null;

  // ✅ best: you set metadata.order_id when creating the checkout session
  const orderIdFromMeta = session?.metadata?.order_id
    ? String(session.metadata.order_id)
    : null;

  let order = null;

  if (orderIdFromMeta) {
    const [rows] = await connection.execute(
      `SELECT * FROM orders WHERE id = ? LIMIT 1`,
      [orderIdFromMeta]
    );
    order = rows?.[0] ?? null;
  }

  // fallback: find by payment intent (order_payments)
  if (!order && paymentIntentId) {
    order = await findOrderByPaymentIntent(connection, paymentIntentId);
  }

  if (!order) return;

  // Optional: if you want, store address details from Stripe
  await upsertOrderAddressFromSession(connection, order.id, session);

  // mark paid
  await markOrderPaid(connection, {
    orderId: order.id,
    paymentIntentId,
    chargeId: null,
  });
}

async function handlePaymentIntentSucceeded(connection, pi) {
  const paymentIntentId = pi?.id ? String(pi.id) : null;
  if (!paymentIntentId) return;

  const order = await findOrderByPaymentIntent(connection, paymentIntentId);
  if (!order) return;

  const chargeId =
    Array.isArray(pi?.charges?.data) && pi.charges.data[0]?.id
      ? String(pi.charges.data[0].id)
      : null;

  await markOrderPaid(connection, {
    orderId: order.id,
    paymentIntentId,
    chargeId,
  });
}

async function handlePaymentIntentFailed(connection, pi) {
  const paymentIntentId = pi?.id ? String(pi.id) : null;
  if (!paymentIntentId) return;

  const order = await findOrderByPaymentIntent(connection, paymentIntentId);
  if (!order) return;

  // your enum doesn't have "payment_failed" => choose a valid status
  await connection.execute(
    `UPDATE orders SET status = 'cancelled', updated_at = NOW() WHERE id = ?`,
    [order.id]
  );

  await connection.execute(
    `UPDATE order_payments SET status = 'failed', updated_at = NOW() WHERE order_id = ?`,
    [order.id]
  );
}

export async function stripeWebhook(req, res) {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!endpointSecret) return res.status(500).send("Missing STRIPE_WEBHOOK_SECRET");

  let event;
  try {
    // ✅ req.body must be raw Buffer (express.raw)
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err?.message || err);
    return res.status(400).send(`Webhook Error: ${err?.message || "Invalid signature"}`);
  }

  const connection = await getConnection();
  try {
    await connection.beginTransaction();

    if (await alreadyProcessed(connection, event.id)) {
      await connection.rollback();
      return res.status(200).json({ received: true, duplicated: true });
    }

    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(connection, event.data.object);
        break;

      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(connection, event.data.object);
        break;

      case "payment_intent.payment_failed":
        await handlePaymentIntentFailed(connection, event.data.object);
        break;

      default:
        break;
    }

    await markProcessed(connection, event);
    await connection.commit();
    return res.json({ received: true });
  } catch (e) {
    await connection.rollback();
    console.error("stripeWebhook error:", e);
    return res.status(500).json({ error: "Webhook handler failed" });
  } finally {
    connection.release();
  }
}
