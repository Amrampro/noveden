// client/src/services/newsletterService.ts
import { apiEndpoints } from "./apiEndpoints";

export type NewsletterSubscriber = {
  id: number;
  email: string;
  created_at: string;
};

async function jsonFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });

  // if your API returns JSON errors, try parse, else fallback text
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || `Request failed (${res.status})`);
  }

  return (await res.json()) as T;
}

export const newsletterService = {
  subscribe(email: string) {
    return jsonFetch<{ status: "subscribed" | "already_subscribed"; message?: string }>(
      apiEndpoints.newsletter.subscribe,
      { method: "POST", body: JSON.stringify({ email }) }
    );
  },

  adminList(params?: { limit?: number; offset?: number }) {
    const qs = new URLSearchParams();
    if (params?.limit) qs.set("limit", String(params.limit));
    if (params?.offset) qs.set("offset", String(params.offset));
    const url = `${apiEndpoints.newsletter.adminList}${qs.toString() ? `?${qs}` : ""}`;

    return jsonFetch<{ items: NewsletterSubscriber[]; total: number }>(url);
  },

  adminDelete(id: number) {
    return jsonFetch<{ ok: boolean; affected: number }>(
      apiEndpoints.newsletter.adminDelete(id),
      { method: "DELETE" }
    );
  },
};
