// api/src/controllers/stripeWebhook.controller.js
import Stripe from "stripe";
import { getConnection } from "../config/database.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

async function findOrderPaymentBySessionId(connection, sessionId) {
  const [rows] = await connection.execute(
    `SELECT * FROM order_payments WHERE stripe_checkout_session_id = ? LIMIT 1`,
    [sessionId]
  );
  return rows?.[0] ?? null;
}

async function findOrderPaymentByPaymentIntentId(connection, paymentIntentId) {
  const [rows] = await connection.execute(
    `SELECT * FROM order_payments WHERE stripe_payment_intent_id = ? LIMIT 1`,
    [paymentIntentId]
  );
  return rows?.[0] ?? null;
}

async function markOrderPaid(connection, orderId) {
  await connection.execute(
    `
    UPDATE orders
    SET status = 'paid',
        updated_at = NOW()
    WHERE id = ?
    `,
    [orderId]
  );
}

async function markPaymentSucceeded(connection, paymentId, paymentIntentId = null) {
  await connection.execute(
    `
    UPDATE order_payments
    SET status = 'succeeded',
        stripe_payment_intent_id = COALESCE(stripe_payment_intent_id, ?),
        updated_at = NOW()
    WHERE id = ?
    `,
    [paymentIntentId, paymentId]
  );
}

/**
 * webhook controller
 * IMPORTANT: route must use express.raw({ type: "application/json" })
 */
export async function stripeWebhook(req, res) {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!endpointSecret) return res.status(500).send("Missing STRIPE_WEBHOOK_SECRET");

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err?.message || err);
    return res.status(400).send("Webhook Error");
  }

  const connection = await getConnection();
  try {
    await connection.beginTransaction();

    // ✅ checkout completed: best event for Checkout flow
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const sessionId = session.id;
      const paymentIntentId = session.payment_intent ?? null;

      // 1) find by checkout session id (recommended)
      let payment = await findOrderPaymentBySessionId(connection, sessionId);

      // 2) fallback: find by payment intent (if you stored it)
      if (!payment && paymentIntentId) {
        payment = await findOrderPaymentByPaymentIntentId(connection, paymentIntentId);
      }

      if (!payment) {
        console.warn("⚠️ No order_payments row found for session/paymentIntent", {
          sessionId,
          paymentIntentId,
        });
        await connection.commit();
        return res.json({ received: true, ignored: true });
      }

      // Update payment + order
      await markPaymentSucceeded(connection, payment.id, paymentIntentId);
      await markOrderPaid(connection, payment.order_id);

      await connection.commit();
      return res.json({ received: true });
    }

    // Optional safety: payment_intent.succeeded
    if (event.type === "payment_intent.succeeded") {
      const pi = event.data.object;
      const payment = await findOrderPaymentByPaymentIntentId(connection, pi.id);

      if (payment) {
        await markPaymentSucceeded(connection, payment.id, pi.id);
        await markOrderPaid(connection, payment.order_id);
      }

      await connection.commit();
      return res.json({ received: true });
    }

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
