/*
  # User Authentication, Orders, and Coupon System

  ## Overview
  This migration creates a complete e-commerce user authentication and order management system with coupon functionality.

  ## New Tables

  ### 1. `user_profiles`
  Extends Supabase auth.users with additional user information:
    - `id` (uuid, FK to auth.users) - Primary key
    - `first_name` (text) - User's first name
    - `last_name` (text) - User's last name  
    - `phone` (text) - Phone number
    - `is_admin` (boolean, default: false) - Admin flag
    - `created_at` (timestamptz) - Account creation timestamp
    - `updated_at` (timestamptz) - Last update timestamp

  ### 2. `user_addresses`
  Stores multiple addresses per user:
    - `id` (uuid, PK) - Unique address ID
    - `user_id` (uuid, FK to auth.users) - Owner of address
    - `first_name` (text) - Recipient first name
    - `last_name` (text) - Recipient last name
    - `email` (text) - Recipient email
    - `phone` (text) - Contact phone
    - `address_line1` (text) - Street address
    - `address_line2` (text, optional) - Apartment, suite, etc.
    - `town` (text) - City/town
    - `postal_code` (text) - ZIP/postal code
    - `country` (text) - Country name
    - `is_default` (boolean, default: false) - Default address flag
    - `created_at` (timestamptz) - Creation timestamp

  ### 3. `orders`
  Stores customer orders:
    - `id` (uuid, PK) - Unique order ID
    - `user_id` (uuid, FK to auth.users) - Customer who placed order
    - `order_number` (text, unique) - Human-readable order number
    - `status` (text) - Order status (pending, processing, shipped, delivered, cancelled)
    - `subtotal` (decimal) - Order subtotal before discounts
    - `discount_amount` (decimal, default: 0) - Total discount applied
    - `total` (decimal) - Final order total
    - `coupon_id` (uuid, FK to coupons, optional) - Applied coupon
    - `shipping_first_name` (text) - Shipping recipient first name
    - `shipping_last_name` (text) - Shipping recipient last name
    - `shipping_email` (text) - Shipping email
    - `shipping_phone` (text) - Shipping phone
    - `shipping_address_line1` (text) - Shipping street address
    - `shipping_address_line2` (text, optional) - Shipping apartment/suite
    - `shipping_town` (text) - Shipping city
    - `shipping_postal_code` (text) - Shipping postal code
    - `shipping_country` (text) - Shipping country
    - `notes` (text, optional) - Customer notes
    - `created_at` (timestamptz) - Order creation timestamp
    - `updated_at` (timestamptz) - Last update timestamp

  ### 4. `order_items`
  Stores items within each order:
    - `id` (uuid, PK) - Unique item ID
    - `order_id` (uuid, FK to orders) - Parent order
    - `product_id` (uuid, FK to products) - Ordered product
    - `product_name` (text) - Product name (snapshot)
    - `product_price` (decimal) - Product price at time of order
    - `quantity` (integer) - Quantity ordered
    - `subtotal` (decimal) - Line item subtotal (price × quantity)
    - `created_at` (timestamptz) - Creation timestamp

  ### 5. `coupons`
  Stores discount coupons:
    - `id` (uuid, PK) - Unique coupon ID
    - `code` (text, unique) - Coupon code (e.g., "WELCOME10")
    - `description` (text) - Coupon description
    - `discount_type` (text) - Type: "percentage" or "fixed"
    - `discount_value` (decimal) - Discount amount (e.g., 10 for 10% or 10€)
    - `min_purchase_amount` (decimal, optional) - Minimum order value required
    - `max_discount_amount` (decimal, optional) - Maximum discount cap for percentage coupons
    - `valid_from` (timestamptz) - Coupon start date
    - `valid_until` (timestamptz, optional) - Coupon expiration date
    - `usage_limit_per_user` (integer, default: 1) - How many times each user can use
    - `total_usage_limit` (integer, optional) - Global usage limit
    - `current_usage_count` (integer, default: 0) - Times used globally
    - `is_active` (boolean, default: true) - Active status
    - `requires_first_order` (boolean, default: false) - Only for first-time buyers
    - `requires_min_orders` (integer, default: 0) - Minimum order history required
    - `created_at` (timestamptz) - Creation timestamp

  ### 6. `coupon_usage`
  Tracks which users have used which coupons:
    - `id` (uuid, PK) - Unique usage record ID
    - `coupon_id` (uuid, FK to coupons) - Used coupon
    - `user_id` (uuid, FK to auth.users) - User who used coupon
    - `order_id` (uuid, FK to orders) - Order where coupon was applied
    - `discount_applied` (decimal) - Actual discount amount given
    - `created_at` (timestamptz) - Usage timestamp

  ## Security
  - All tables have RLS enabled
  - Users can only read/update their own data
  - Admins have full access to all data
  - Public cannot access any data without authentication
  - Order numbers are generated automatically

  ## Important Notes
  - User profiles are automatically created via trigger when users sign up
  - Order numbers use format: ORD-YYYYMMDD-XXXXX
  - Coupons can have complex eligibility rules (first order, minimum orders, etc.)
  - Coupon usage is tracked to prevent duplicate usage
  - Addresses can be marked as default for quick checkout
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text NOT NULL DEFAULT '',
  last_name text NOT NULL DEFAULT '',
  phone text DEFAULT '',
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_addresses table
CREATE TABLE IF NOT EXISTS user_addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  address_line1 text NOT NULL,
  address_line2 text DEFAULT '',
  town text NOT NULL,
  postal_code text NOT NULL,
  country text NOT NULL,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  order_number text UNIQUE NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  subtotal decimal(10,2) NOT NULL,
  discount_amount decimal(10,2) DEFAULT 0,
  total decimal(10,2) NOT NULL,
  coupon_id uuid,
  shipping_first_name text NOT NULL,
  shipping_last_name text NOT NULL,
  shipping_email text NOT NULL,
  shipping_phone text NOT NULL,
  shipping_address_line1 text NOT NULL,
  shipping_address_line2 text DEFAULT '',
  shipping_town text NOT NULL,
  shipping_postal_code text NOT NULL,
  shipping_country text NOT NULL,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  product_price decimal(10,2) NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  subtotal decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create coupons table
CREATE TABLE IF NOT EXISTS coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  description text NOT NULL,
  discount_type text NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value decimal(10,2) NOT NULL CHECK (discount_value >= 0),
  min_purchase_amount decimal(10,2) DEFAULT 0,
  max_discount_amount decimal(10,2),
  valid_from timestamptz DEFAULT now(),
  valid_until timestamptz,
  usage_limit_per_user integer DEFAULT 1 CHECK (usage_limit_per_user > 0),
  total_usage_limit integer,
  current_usage_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  requires_first_order boolean DEFAULT false,
  requires_min_orders integer DEFAULT 0 CHECK (requires_min_orders >= 0),
  created_at timestamptz DEFAULT now()
);

-- Create coupon_usage table
CREATE TABLE IF NOT EXISTS coupon_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id uuid REFERENCES coupons(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  order_id uuid REFERENCES orders(id) ON DELETE SET NULL,
  discount_applied decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(coupon_id, user_id, order_id)
);

-- Add foreign key for orders.coupon_id (done after coupons table exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'orders_coupon_id_fkey'
  ) THEN
    ALTER TABLE orders ADD CONSTRAINT orders_coupon_id_fkey 
    FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_addresses_user_id ON user_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_user_addresses_is_default ON user_addresses(user_id, is_default);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_is_active ON coupons(is_active);
CREATE INDEX IF NOT EXISTS idx_coupon_usage_coupon_id ON coupon_usage(coupon_id);
CREATE INDEX IF NOT EXISTS idx_coupon_usage_user_id ON coupon_usage(user_id);

-- Create function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS text AS $$
DECLARE
  new_order_number text;
  date_part text;
  counter integer;
BEGIN
  date_part := TO_CHAR(CURRENT_DATE, 'YYYYMMDD');
  
  SELECT COUNT(*) + 1 INTO counter
  FROM orders
  WHERE order_number LIKE 'ORD-' || date_part || '-%';
  
  new_order_number := 'ORD-' || date_part || '-' || LPAD(counter::text, 5, '0');
  
  RETURN new_order_number;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate order number
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_set_order_number'
  ) THEN
    CREATE TRIGGER trigger_set_order_number
    BEFORE INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION set_order_number();
  END IF;
END $$;

-- Create trigger to auto-create user profile on signup
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, first_name, last_name)
  VALUES (NEW.id, '', '')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION create_user_profile();
  END IF;
END $$;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_profiles_updated_at'
  ) THEN
    CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_orders_updated_at'
  ) THEN
    CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- RLS Policies for user_addresses
CREATE POLICY "Users can view own addresses"
  ON user_addresses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own addresses"
  ON user_addresses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own addresses"
  ON user_addresses FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own addresses"
  ON user_addresses FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for orders
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can update all orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- RLS Policies for order_items
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create order items for own orders"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- RLS Policies for coupons
CREATE POLICY "Anyone can view active coupons"
  ON coupons FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage coupons"
  ON coupons FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- RLS Policies for coupon_usage
CREATE POLICY "Users can view own coupon usage"
  ON coupon_usage FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can record own coupon usage"
  ON coupon_usage FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all coupon usage"
  ON coupon_usage FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );
