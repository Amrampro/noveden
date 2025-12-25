const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string) {
    this.token = token;
    try {
      localStorage.setItem('auth_token', token);
    } catch (error) {
      if (error instanceof DOMException && (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
        console.warn('localStorage quota exceeded, clearing old data...');
        try {
          localStorage.clear();
          localStorage.setItem('auth_token', token);
        } catch (retryError) {
          console.error('Failed to store auth token even after clearing localStorage:', retryError);
        }
      } else {
        console.error('Failed to store auth token:', error);
      }
    }
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }

    return data;
  }

  async signup(email: string, password: string, firstName: string, lastName: string, phone: string) {
    const data = await this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, firstName, lastName, phone }),
    });

    if (data.token) {
      this.setToken(data.token);
    }

    return data;
  }

  async login(email: string, password: string) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (data.token) {
      this.setToken(data.token);
    }

    return data;
  }

  async logout() {
    this.clearToken();
  }

  async getProfile() {
    return await this.request('/auth/profile');
  }

  async updateProfile(updates: { firstName?: string; lastName?: string; phone?: string }) {
    return await this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async getProducts(params?: { category?: string; featured?: boolean; search?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return await this.request(`/products?${query}`);
  }

  async getProductBySlug(slug: string) {
    return await this.request(`/products/${slug}`);
  }

  async getCategories() {
    return await this.request('/products/categories');
  }

  async validateCoupon(code: string, cartTotal: number) {
    return await this.request('/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code, cartTotal }),
    });
  }

  async getBlogPosts(params?: { category?: string; limit?: number; offset?: number }) {
    const query = new URLSearchParams(params as any).toString();
    return await this.request(`/blog?${query}`);
  }

  async getBlogPostBySlug(slug: string) {
    return await this.request(`/blog/${slug}`);
  }

  async getFAQs(params?: { category?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return await this.request(`/faq?${query}`);
  }

  async adminGetUsers(params?: { search?: string; limit?: number; offset?: number }) {
    const query = new URLSearchParams(params as any).toString();
    return await this.request(`/admin/users?${query}`);
  }

  async adminGetProducts(params?: { search?: string; category?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return await this.request(`/admin/products?${query}`);
  }

  async adminCreateProduct(product: any) {
    return await this.request('/admin/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  }

  async adminUpdateProduct(id: string, product: any) {
    return await this.request(`/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
  }

  async adminDeleteProduct(id: string) {
    return await this.request(`/admin/products/${id}`, {
      method: 'DELETE',
    });
  }

  async adminGetCoupons() {
    return await this.request('/admin/coupons');
  }

  async adminCreateCoupon(coupon: any) {
    return await this.request('/admin/coupons', {
      method: 'POST',
      body: JSON.stringify(coupon),
    });
  }

  async adminUpdateCoupon(id: string, coupon: any) {
    return await this.request(`/admin/coupons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(coupon),
    });
  }

  async adminDeleteCoupon(id: string) {
    return await this.request(`/admin/coupons/${id}`, {
      method: 'DELETE',
    });
  }

  async adminGetOrders(params?: { status?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return await this.request(`/admin/orders?${query}`);
  }

  async adminUpdateOrderStatus(id: string, status: string) {
    return await this.request(`/admin/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async adminGetBlogPosts() {
    return await this.request('/admin/blog');
  }

  async adminCreateBlogPost(post: any) {
    return await this.request('/admin/blog', {
      method: 'POST',
      body: JSON.stringify(post),
    });
  }

  async adminUpdateBlogPost(id: string, post: any) {
    return await this.request(`/admin/blog/${id}`, {
      method: 'PUT',
      body: JSON.stringify(post),
    });
  }

  async adminDeleteBlogPost(id: string) {
    return await this.request(`/admin/blog/${id}`, {
      method: 'DELETE',
    });
  }

  async adminGetFAQs() {
    return await this.request('/admin/faq');
  }

  async adminCreateFAQ(faq: any) {
    return await this.request('/admin/faq', {
      method: 'POST',
      body: JSON.stringify(faq),
    });
  }

  async adminUpdateFAQ(id: string, faq: any) {
    return await this.request(`/admin/faq/${id}`, {
      method: 'PUT',
      body: JSON.stringify(faq),
    });
  }

  async adminDeleteFAQ(id: string) {
    return await this.request(`/admin/faq/${id}`, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiService();
