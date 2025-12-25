const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const API_ENDPOINTS = {
  BASE_URL: API_BASE_URL,

  AUTH: {
    SIGNUP: `${API_BASE_URL}/auth/signup`,
    LOGIN: `${API_BASE_URL}/auth/login`,
    PROFILE: `${API_BASE_URL}/auth/profile`,
    UPDATE_PROFILE: `${API_BASE_URL}/auth/profile`,
  },

  PRODUCTS: {
    LIST: `${API_BASE_URL}/products`,
    BY_SLUG: (slug: string) => `${API_BASE_URL}/products/${slug}`,
    CATEGORIES: `${API_BASE_URL}/products/categories`,
  },

  COUPONS: {
    VALIDATE: `${API_BASE_URL}/coupons/validate`,
  },

  BLOG: {
    LIST: `${API_BASE_URL}/blog`,
    BY_SLUG: (slug: string) => `${API_BASE_URL}/blog/${slug}`,
  },

  FAQ: {
    LIST: `${API_BASE_URL}/faq`,
  },

  ADMIN: {
    USERS: {
      LIST: `${API_BASE_URL}/admin/users`,
      BY_ID: (id: string) => `${API_BASE_URL}/admin/users/${id}`,
      UPDATE: (id: string) => `${API_BASE_URL}/admin/users/${id}`,
      DELETE: (id: string) => `${API_BASE_URL}/admin/users/${id}`,
    },
    PRODUCTS: {
      LIST: `${API_BASE_URL}/admin/products`,
      CREATE: `${API_BASE_URL}/admin/products`,
      UPDATE: (id: string) => `${API_BASE_URL}/admin/products/${id}`,
      DELETE: (id: string) => `${API_BASE_URL}/admin/products/${id}`,
    },
    COUPONS: {
      LIST: `${API_BASE_URL}/admin/coupons`,
      CREATE: `${API_BASE_URL}/admin/coupons`,
      UPDATE: (id: string) => `${API_BASE_URL}/admin/coupons/${id}`,
      DELETE: (id: string) => `${API_BASE_URL}/admin/coupons/${id}`,
    },
    BLOG: {
      LIST: `${API_BASE_URL}/admin/blog`,
      CREATE: `${API_BASE_URL}/admin/blog`,
      UPDATE: (id: string) => `${API_BASE_URL}/admin/blog/${id}`,
      DELETE: (id: string) => `${API_BASE_URL}/admin/blog/${id}`,
    },
    FAQ: {
      LIST: `${API_BASE_URL}/admin/faq`,
      CREATE: `${API_BASE_URL}/admin/faq`,
      UPDATE: (id: string) => `${API_BASE_URL}/admin/faq/${id}`,
      DELETE: (id: string) => `${API_BASE_URL}/admin/faq/${id}`,
    },
    ORDERS: {
      LIST: `${API_BASE_URL}/admin/orders`,
      BY_ID: (id: string) => `${API_BASE_URL}/admin/orders/${id}`,
      UPDATE_STATUS: (id: string) => `${API_BASE_URL}/admin/orders/${id}/status`,
      DELETE: (id: string) => `${API_BASE_URL}/admin/orders/${id}`,
    },
  },
} as const;

export default API_ENDPOINTS;
