// api/src/services/orders.service.js
import crypto from "node:crypto";
import Stripe from "stripe";
import { getConnection, query } from "../config/database.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

const toInt = (v, def = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.round(n) : def;
};

async function fetchProductsForCartItems(connection, cartItems) {
  if (!Array.isArray(cartItems) || cartItems.length === 0) return [];

  const ids = cartItems.map((x) => String(x.product_id));
  const placeholders = ids.map(() => "?").join(",");

  // ⚠️ adapte si ta table/colonnes produits sont différentes
  const [rows] = await connection.execute(
    `SELECT id, name, price FROM products WHERE id IN (${placeholders})`,
    ids
  );

  const products = rows || [];
  const map = new Map(products.map((p) => [String(p.id), p]));

  return cartItems.map((ci) => {
    const p = map.get(String(ci.product_id));
    if (!p) throw new Error(`Product not found: ${ci.product_id}`);

    const quantity = Math.max(1, toInt(ci.quantity, 1));

    // IMPORTANT: ton schéma orders_* utilise INT.
    // Ici on suppose que products.price est en CENTIMES (ex: 1999 = 19,99€).
    // Si chez toi products.price est en euros (19.99), convertis en cents.
    const unitPrice = toInt(p.price * 100, 0);

    return {
      product_id: String(ci.product_id),
      product_name: String(p.name),
      unit_price: unitPrice, // cents
      quantity,
      line_total: unitPrice * quantity,
    };
  });
}

export async function createCheckout({ userId, cart_items, coupon_code, shipping }) {
  if (!userId) throw new Error("Unauthorized");
  if (!Array.isArray(cart_items) || cart_items.length === 0) throw new Error("Cart is empty");
  if (!shipping?.method) throw new Error("Shipping method is required");
  if (!shipping?.address) throw new Error("Shipping address is required");

  const currency = "EUR";

  const connection = await getConnection();
  try {
    await connection.beginTransaction();

    // 1) normalize items + compute totals
    const normalizedItems = await fetchProductsForCartItems(connection, cart_items);

    const subtotal_amount = normalizedItems.reduce((sum, it) => sum + toInt(it.line_total, 0), 0);
    const discount_amount = 0; // TODO: appliquer coupon si tu veux
    const shipping_amount = 0; // TODO: calculer shipping si tu veux
    const total_amount = subtotal_amount - discount_amount + shipping_amount;

    const orderId = crypto.randomUUID();

    // 2) create order (aligné à TON schéma)
    await connection.execute(
      `
      INSERT INTO orders
        (id, user_id, status, currency,
         subtotal_amount, discount_amount, shipping_amount, total_amount,
         coupon_code, shipping_method, shipping_status,
         shipping_tracking_number, shipping_tracking_url,
         created_at, updated_at)
      VALUES
        (?, ?, 'pending_payment', ?,
         ?, ?, ?, ?,
         ?, ?, 'not_set',
         NULL, NULL,
         NOW(), NOW())
      `,
      [
        orderId,
        userId,
        currency,
        subtotal_amount,
        discount_amount,
        shipping_amount,
        total_amount,
        coupon_code ?? null,
        shipping.method,
      ]
    );

    // 3) insert items
    for (const it of normalizedItems) {
      await connection.execute(
        `
        INSERT INTO order_items
          (id, order_id, product_id, product_name, unit_price, quantity, line_total, created_at)
        VALUES
          (?, ?, ?, ?, ?, ?, ?, NOW())
        `,
        [
          crypto.randomUUID(),
          orderId,
          it.product_id,
          it.product_name,
          it.unit_price,
          it.quantity,
          it.line_total,
        ]
      );
    }

    // 4) address
    const a = shipping.address;
    await connection.execute(
      `
      INSERT INTO order_addresses
        (id, order_id, full_name, email, phone, country, city, postal_code, address1, address2, created_at, updated_at)
      VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `,
      [
        crypto.randomUUID(),
        orderId,
        a.full_name,
        a.email,
        a.phone,
        a.country,
        a.city,
        a.postal_code,
        a.address1,
        a.address2 ?? null,
      ]
    );

    // 5) shipping details table (mondial relay)
    const relay = shipping.method === "mondial_relay" ? (shipping.relay_point ?? null) : null;

    await connection.execute(
      `
      INSERT INTO order_shipping
        (id, order_id, provider, relay_point_id, relay_point_name, relay_point_address,
         label_url, tracking_number, tracking_url, created_at, updated_at)
      VALUES
        (?, ?, 'mondial_relay', ?, ?, ?, NULL, NULL, NULL, NOW(), NOW())
      `,
      [
        crypto.randomUUID(),
        orderId,
        relay?.id ?? null,
        relay?.name ?? null,
        relay?.address ?? null,
      ]
    );

    // 6) create Stripe Checkout Session (hosted payment page)
    const successUrl =
      process.env.STRIPE_SUCCESS_URL ||
      "http://localhost:5173/order-success?order_id={CHECKOUT_SESSION_ID}";
    const cancelUrl =
      process.env.STRIPE_CANCEL_URL ||
      "http://localhost:5173/checkout?canceled=1";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      currency: "eur",
      line_items: normalizedItems.map((it) => ({
        quantity: it.quantity,
        price_data: {
          currency: "eur",
          unit_amount: it.unit_price, // cents
          product_data: {
            name: it.product_name,
          },
        },
      })),
      metadata: {
        order_id: orderId,
        user_id: String(userId),
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    // 7) record payment row (your schema)
    await connection.execute(
      `
      INSERT INTO order_payments
        (id, order_id, provider, status, stripe_payment_intent_id, stripe_charge_id,
         amount, currency, created_at, updated_at)
      VALUES
        (?, ?, 'stripe', 'requires_payment', ?, NULL,
         ?, ?, NOW(), NOW())
      `,
      [
        crypto.randomUUID(),
        orderId,
        session.payment_intent ?? null,
        total_amount,
        currency,
      ]
    );

    await connection.commit();

    return {
      order: { id: orderId, total_amount, currency, status: "pending_payment" },
      stripe: {
        session_id: session.id,
        checkout_url: session.url,
      },
    };
  } catch (e) {
    await connection.rollback();
    throw e;
  } finally {
    connection.release();
  }
}

export async function getOrderForUser({ userId, orderId }) {
  if (!userId) throw new Error("Unauthorized");
  if (!orderId) throw new Error("orderId is required");

  const [order] = await query(
    `SELECT * FROM orders WHERE id = ? AND user_id = ? LIMIT 1`,
    [orderId, userId]
  );
  if (!order) throw new Error("Order not found");

  const items = await query(
    `SELECT * FROM order_items WHERE order_id = ? ORDER BY created_at ASC`,
    [orderId]
  );
  const [address] = await query(
    `SELECT * FROM order_addresses WHERE order_id = ? LIMIT 1`,
    [orderId]
  );
  const [shipping] = await query(
    `SELECT * FROM order_shipping WHERE order_id = ? LIMIT 1`,
    [orderId]
  );
  const [payment] = await query(
    `SELECT * FROM order_payments WHERE order_id = ? LIMIT 1`,
    [orderId]
  );

  return { order, items, address: address ?? null, shipping: shipping ?? null, payment: payment ?? null };
}
