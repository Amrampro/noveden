export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: number;
  compare_at_price?: number;
  image_url: string;
  category_id?: string;
  stock_status: 'in_stock' | 'limited' | 'out_of_stock';
  is_featured: boolean;
  is_new: boolean;
  ingredients: string;
  usage: string;
  benefits: string[];
  average_rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
  categories?: Category;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url: string;
  category: string;
  reading_time: number;
  views: number;
  published_at: string;
  created_at: string;
  updated_at: string;
};

export type FAQ = {
  id: string;
  question: string;
  answer: string;
  category: string;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type ProductReview = {
  id: string;
  product_id: string;
  customer_name: string;
  customer_email: string;
  rating: number;
  title: string;
  comment: string;
  is_verified_purchase: boolean;
  helpful_count: number;
  created_at: string;
  updated_at: string;
};

export type ProductImage = {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string;
  display_order: number;
  is_primary: boolean;
  created_at: string;
};

export type UserProfile = {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
};

export type UserAddress = {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address_line1: string;
  address_line2: string;
  town: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
};

export type Order = {
  id: string;
  user_id: string;
  order_number: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  discount_amount: number;
  total: number;
  coupon_id?: string;
  shipping_first_name: string;
  shipping_last_name: string;
  shipping_email: string;
  shipping_phone: string;
  shipping_address_line1: string;
  shipping_address_line2: string;
  shipping_town: string;
  shipping_postal_code: string;
  shipping_country: string;
  notes: string;
  created_at: string;
  updated_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_price: number;
  quantity: number;
  subtotal: number;
  created_at: string;
};

export type Coupon = {
  id: string;
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_purchase_amount: number;
  max_discount_amount?: number;
  valid_from: string;
  valid_until?: string;
  usage_limit_per_user: number;
  total_usage_limit?: number;
  current_usage_count: number;
  is_active: boolean;
  requires_first_order: boolean;
  requires_min_orders: number;
  created_at: string;
};

export type CouponUsage = {
  id: string;
  coupon_id: string;
  user_id: string;
  order_id: string;
  discount_applied: number;
  created_at: string;
};
