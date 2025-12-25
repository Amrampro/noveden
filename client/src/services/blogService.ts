// client/src/services/blogService.ts
import { apiEndpoints } from "./apiEndpoints";

export type BlogCategory = {
  id: string;
  parent_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  image_url: string | null;
  reading_time: number;
  views: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  categories?: BlogCategory[];
};

type ListPostsParams = {
  category?: string; // category slug
  limit?: number;
  offset?: number;
};

type AdminListPostsParams = {
  status?: "published" | "draft";
  category?: string; // category slug
  search?: string;
  limit?: number;
  offset?: number;
};

type CreatePostPayload = {
  title: string;
  slug?: string;
  excerpt?: string | null;
  content: string;
  image_url?: string | null;
  reading_time?: number;
  published_at?: string | null;
  category_ids?: string[];
};

type UpdatePostPayload = Partial<CreatePostPayload>;

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

export const blogService = {
  // ---------- Public ----------
  listPosts(params: ListPostsParams = {}) {
    return http<{ posts: BlogPost[] }>(`${apiEndpoints.blog.list}${qs(params)}`);
  },

  getPostBySlug(slug: string) {
    return http<{ post: BlogPost }>(apiEndpoints.blog.bySlug(slug));
  },

  // ---------- Categories ----------
  listCategories() {
    return http<{ categories: BlogCategory[] }>(apiEndpoints.blogCategories.list);
  },

  // ---------- Admin ----------
  adminListPosts(params: AdminListPostsParams = {}) {
    return http<{ posts: BlogPost[] }>(`${apiEndpoints.blog.admin.list}${qs(params)}`);
  },

  adminGetPostById(id: string) {
    return http<{ post: BlogPost }>(apiEndpoints.blog.admin.byId(id));
  },

  adminCreatePost(payload: CreatePostPayload) {
    return http<{ post: BlogPost }>(apiEndpoints.blog.admin.create, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  adminUpdatePost(id: string, payload: UpdatePostPayload) {
    return http<{ post: BlogPost }>(apiEndpoints.blog.admin.update(id), {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  adminDeletePost(id: string) {
    return http<{ success: true }>(apiEndpoints.blog.admin.delete(id), {
      method: "DELETE",
    });
  },

  adminPublishPost(id: string) {
    return http<{ post: BlogPost }>(apiEndpoints.blog.admin.publish(id), {
      method: "PATCH",
    });
  },

  adminUnpublishPost(id: string) {
    return http<{ post: BlogPost }>(apiEndpoints.blog.admin.unpublish(id), {
      method: "PATCH",
    });
  },

  adminCreateCategory(payload: {
    name: string;
    slug?: string;
    description?: string | null;
    image_url?: string | null;
    display_order?: number;
    parent_id?: string | null;
  }) {
    return http<{ category: BlogCategory }>(apiEndpoints.blogCategories.create, {
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
    return http<{ category: BlogCategory }>(apiEndpoints.blogCategories.update(id), {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  adminDeleteCategory(id: string) {
    return http<{ success: true }>(apiEndpoints.blogCategories.delete(id), {
      method: "DELETE",
    });
  },

  // ---------- Uploads ----------
  async uploadBlogImage(file: File) {
    const fd = new FormData();
    fd.append("file", file); // backend expects field "file"
    const data = await httpForm<{ url: string }>(apiEndpoints.uploads.productImage, fd);
    return data; // { url }
  },
};
