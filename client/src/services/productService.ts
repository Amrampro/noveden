// client/src/services/productService.ts
import { apiEndpoints } from "./apiEndpoints";
import type {
  Product,
  ProductCategory,
  ProductImage,
  ProductReview,
} from "../lib/types";

type ListProductsParams = {
  category?: string; // category slug
  featured?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
};

type CreateProductPayload = {
  name: string;
  slug?: string;
  description?: string | null;
  short_description?: string | null;
  price: number;
  compare_at_price?: number | null;
  image_url?: string | null;
  stock_status?: "in_stock" | "limited" | "out_of_stock";
  is_featured?: boolean;
  is_new?: boolean;
  ingredients?: string | null;
  usage?: string | null;
  benefits?: any[];
  category_ids?: string[];
};

type UpdateProductPayload = Partial<CreateProductPayload>;

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

async function httpForm<T>(url: string, formData: FormData): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    body: formData,
    credentials: "include",
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

// --- Normalizers (fix MySQL tinyint/decimals coming as strings/numbers) ---
const toBool = (v: any) => v === true || v === 1 || v === "1";
const toNum = (v: any) =>
  v === null || v === undefined || v === "" ? v : Number(v);

function normalizeImage(raw: any): ProductImage {
  return {
    ...raw,
    is_primary: toBool(raw.is_primary),
    display_order: toNum(raw.display_order) ?? 0,
  };
}

function normalizeProduct(raw: any): Product {
  return {
    ...raw,
    price: toNum(raw.price) ?? 0,
    compare_at_price:
      raw.compare_at_price == null ? null : toNum(raw.compare_at_price),
    average_rating: toNum(raw.average_rating) ?? 0,
    review_count: toNum(raw.review_count) ?? 0,

    is_featured: toBool(raw.is_featured),
    is_new: toBool(raw.is_new),

    // keep safe
    benefits: Array.isArray(raw.benefits) ? raw.benefits : [],
    categories: Array.isArray(raw.categories) ? raw.categories : [],
    images: Array.isArray(raw.images) ? raw.images.map(normalizeImage) : [],
    reviews: Array.isArray(raw.reviews) ? raw.reviews : [],
  };
}

export const productService = {
  // ---------- Public ----------
  async listProducts(params: ListProductsParams = {}) {
    const normalizedParams = {
      ...params,
      featured:
        params.featured === undefined
          ? undefined
          : params.featured
          ? "true"
          : "false",
    };

    const data = await http<{ products: any[] }>(
      `${apiEndpoints.products.list}${qs(normalizedParams)}`
    );

    return { products: (data.products || []).map(normalizeProduct) as Product[] };
  },

  async getProductBySlug(slug: string) {
    const data = await http<{ product: any }>(apiEndpoints.products.bySlug(slug));
    return { product: normalizeProduct(data.product) as Product };
  },

  // ---------- Categories ----------
  listCategories() {
    return http<{ categories: ProductCategory[] }>(apiEndpoints.productCategories.list);
  },

  // ---------- Admin Products ----------
  async adminGetProductById(id: string) {
    const data = await http<{ product: any }>(apiEndpoints.products.admin.byId(id));
    return { product: normalizeProduct(data.product) as Product };
  },

  async adminCreateProduct(payload: CreateProductPayload) {
    const data = await http<{ product: any }>(apiEndpoints.products.admin.create, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return { product: normalizeProduct(data.product) as Product };
  },

  async adminUpdateProduct(id: string, payload: UpdateProductPayload) {
    const data = await http<{ product: any }>(apiEndpoints.products.admin.update(id), {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    return { product: normalizeProduct(data.product) as Product };
  },

  adminDeleteProduct(id: string) {
    return http<{ success: true }>(apiEndpoints.products.admin.delete(id), {
      method: "DELETE",
    });
  },

  // ---------- Admin Categories ----------
  adminCreateCategory(payload: {
    name: string;
    slug?: string;
    description?: string | null;
    image_url?: string | null;
    display_order?: number;
    parent_id?: string | null;
  }) {
    return http<{ category: ProductCategory }>(apiEndpoints.productCategories.create, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  adminUpdateCategory(
    id: string,
    payload: Partial<{
      name: string;
      slug: string;
      description: string | null;
      image_url: string | null;
      display_order: number;
      parent_id: string | null;
    }>
  ) {
    return http<{ category: ProductCategory }>(apiEndpoints.productCategories.update(id), {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  adminDeleteCategory(id: string) {
    return http<{ success: true }>(apiEndpoints.productCategories.delete(id), {
      method: "DELETE",
    });
  },

  // ---------- Uploads ----------
  async uploadProductImage(file: File): Promise<{ url: string }> {
    const fd = new FormData();
    fd.append("file", file); // must match multer: upload.single("file")
    return httpForm<{ url: string }>(apiEndpoints.uploads.productImage, fd);
  },
};
