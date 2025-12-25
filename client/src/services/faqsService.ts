// client/src/services/faqsService.ts
import { apiEndpoints } from "./apiEndpoints";

export type Faq = {
  id: string;
  question: string | null;
  answer: string | null;
  category: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
};

type ListFaqsParams = {
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
};

type CreateFaqPayload = {
  question: string;
  answer: string;
  category?: string | null;
  display_order?: number;
};

type UpdateFaqPayload = Partial<CreateFaqPayload>;

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

const toNum = (v: any) => (v === null || v === undefined || v === "" ? 0 : Number(v));

function normalizeFaq(raw: any): Faq {
  return {
    id: String(raw?.id ?? ""),
    question: raw?.question ?? null,
    answer: raw?.answer ?? null,
    category: raw?.category ?? null,
    display_order: toNum(raw?.display_order),
    created_at: String(raw?.created_at ?? ""),
    updated_at: String(raw?.updated_at ?? ""),
  };
}

export const faqsService = {
  // ---------- Public ----------
  async listFaqs(params: ListFaqsParams = {}) {
    const data = await http<{ faqs: any[] }>(`${apiEndpoints.faqs.list}${qs(params)}`);
    return { faqs: (data.faqs || []).map(normalizeFaq) as Faq[] };
  },

  async getFaqById(id: string) {
    const data = await http<{ faq: any }>(apiEndpoints.faqs.byId(id));
    return { faq: normalizeFaq(data.faq) as Faq };
  },

  // ---------- Admin ----------
  async adminCreateFaq(payload: CreateFaqPayload) {
    const data = await http<{ faq: any }>(apiEndpoints.faqs.admin.create, {
      method: "POST",
      body: JSON.stringify({
        question: payload.question,
        answer: payload.answer,
        category: payload.category ?? null,
        display_order: payload.display_order ?? 0,
      }),
    });
    return { faq: normalizeFaq(data.faq) as Faq };
  },

  async adminUpdateFaq(id: string, payload: UpdateFaqPayload) {
    const data = await http<{ faq: any }>(apiEndpoints.faqs.admin.update(id), {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    return { faq: normalizeFaq(data.faq) as Faq };
  },

  adminDeleteFaq(id: string) {
    return http<{ success: true }>(apiEndpoints.faqs.admin.delete(id), {
      method: "DELETE",
    });
  },
};
