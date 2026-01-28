// client/src/services/ordersService.ts
import { apiEndpoints } from "./apiEndpoints";
import { http } from "./http";

export type CheckoutCartItem = { product_id: string; quantity: number };

export type CheckoutPayload = {
  cart_items: CheckoutCartItem[];
  coupon_code?: string | null;
  shipping: {
    method: "mondial_relay" | "home_delivery";
    amount: number; // ✅ cents
    address: {
      full_name: string;
      email: string;
      phone: string;
      country: string; // "BE"
      city: string;
      postal_code: string;
      address1: string;
      address2?: string | null;
    };
    relay_point?: {
      id: string;
      name?: string | null;
      address?: string | null;
    } | null;
  };
};

export type CheckoutResponse = {
  order: {
    id: string;
    subtotal_amount: number;
    discount_amount: number;
    shipping_amount: number;
    total_amount: number;
    currency: string;
    status: string;
    coupon_code?: string | null;
  };
  stripe: { session_id: string; checkout_url: string };
};

export const ordersService = {
  checkout(payload: CheckoutPayload) {
    return http<CheckoutResponse>(apiEndpoints.orders.checkout, {
      method: "POST",
      body: JSON.stringify(payload),
      auth: false, // ✅ guest
    });
  },

  getMyOrder(id: string) {
    return http<any>(apiEndpoints.orders.byId(id), { method: "GET", auth: false }); // ✅ guest
  },
};
