// client/src/services/adminFinanceService.ts
import { apiEndpoints } from "./apiEndpoints";

export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type ShippingMethod = "mondial_relay" | "home_delivery";

export type AdminFinanceOrderRow = {
  id: string;
  user_id: number;

  status: OrderStatus;

  currency: string;
  subtotal_amount: number;
  discount_amount: number;
  shipping_amount: number;
  total_amount: number;

  coupon_code: string | null;

  shipping_method: ShippingMethod | null;
  shipping_status: string;

  shipping_tracking_number: string | null;
  shipping_tracking_url: string | null;

  created_at: string;
  updated_at: string;

  customer_full_name?: string | null;
  customer_email?: string | null;
  customer_phone?: string | null;
};

export type FinanceStats = {
  total_paid: number;
  total_refunded: number;
  total_pending_payment: number;
  total_in_progress: number;
  total_delivered: number;
  total_cancelled: number;

  count_all: number;
  count_paid: number;
  count_refunded: number;
  count_pending_payment: number;
  count_in_progress: number;
  count_delivered: number;
  count_cancelled: number;

  balance_current: number; // paid
  total_out: number;       // refunded
  net: number;             // paid - refunded
};

export type ListFinanceParams = {
  status?: OrderStatus;
  shipping_method?: ShippingMethod;
  q?: string;
  date_from?: string;
  date_to?: string;
  limit?: number;
  offset?: number;
};

export type ListFinanceResponse = {
  orders: AdminFinanceOrderRow[];
  total: number;
  limit: number;
  offset: number;
  stats: FinanceStats;
};

async function http<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include",
    ...options,
  });

  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await res.json() : null;

  if (!res.ok) {
    const msg = (data && (data.error || data.message)) || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data as T;
}

function qs(params: Record<string, any>) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    sp.set(k, String(v));
  });
  const s = sp.toString();
  return s ? `?${s}` : "";
}

export const adminFinanceService = {
  list(params: ListFinanceParams = {}) {
    return http<ListFinanceResponse>(`${apiEndpoints.adminFinance.list}${qs(params)}`);
  },
};
