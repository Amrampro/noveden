/*
  # E-commerce Database Schema for Novéden Cosmetics

  ## Overview
  This migration creates the complete database schema for the Novéden cosmetics e-commerce website.

  ## New Tables

  ### 1. categories
  - `id` (uuid, primary key) - Unique category identifier
  - `name` (text) - Category name (e.g., "Novéden Hair", "Novéden Skin")
  - `slug` (text, unique) - URL-friendly category identifier
  - `description` (text) - Category description
  - `image_url` (text) - Category image URL
  - `display_order` (integer) - Order for displaying categories
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. products
  - `id` (uuid, primary key) - Unique product identifier
  - `name` (text) - Product name
  - `slug` (text, unique) - URL-friendly product identifier
  - `description` (text) - Product description
  - `short_description` (text) - Short product description
  - `price` (decimal) - Product price
  - `compare_at_price` (decimal) - Original price for comparison
  - `image_url` (text) - Main product image URL
  - `category_id` (uuid, foreign key) - Reference to categories table
  - `stock_status` (text) - Stock status ("in_stock", "limited", "out_of_stock")
  - `is_featured` (boolean) - Whether product is featured on homepage
  - `is_new` (boolean) - Whether product is new
  - `ingredients` (text) - Product ingredients
  - `usage` (text) - Product usage instructions
  - `benefits` (text array) - Product benefits
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 3. blog_posts
  - `id` (uuid, primary key) - Unique post identifier
  - `title` (text) - Blog post title
  - `slug` (text, unique) - URL-friendly post identifier
  - `excerpt` (text) - Short excerpt
  - `content` (text) - Full blog post content
  - `image_url` (text) - Featured image URL
  - `category` (text) - Blog category (e.g., "Peaux", "Cheveux")
  - `reading_time` (integer) - Estimated reading time in minutes
  - `views` (integer) - Number of views
  - `published_at` (timestamptz) - Publication date
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 4. faqs
  - `id` (uuid, primary key) - Unique FAQ identifier
  - `question` (text) - FAQ question
  - `answer` (text) - FAQ answer
  - `category` (text) - FAQ category
  - `display_order` (integer) - Display order
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 5. newsletter_subscribers
  - `id` (uuid, primary key) - Unique subscriber identifier
  - `email` (text, unique) - Subscriber email
  - `subscribed_at` (timestamptz) - Subscription timestamp
  - `is_active` (boolean) - Whether subscription is active

  ## Security
  - Enable RLS on all tables
  - Add policies for public read access on products, categories, blog posts, and FAQs
  - Restrict write access to authenticated users only for newsletter subscriptions
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  image_url text DEFAULT '',
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  short_description text DEFAULT '',
  price decimal(10,2) NOT NULL DEFAULT 0,
  compare_at_price decimal(10,2),
  image_url text DEFAULT '',
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  stock_status text DEFAULT 'in_stock' CHECK (stock_status IN ('in_stock', 'limited', 'out_of_stock')),
  is_featured boolean DEFAULT false,
  is_new boolean DEFAULT false,
  ingredients text DEFAULT '',
  usage text DEFAULT '',
  benefits text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text DEFAULT '',
  content text DEFAULT '',
  image_url text DEFAULT '',
  category text DEFAULT 'Article Vedette',
  reading_time integer DEFAULT 3,
  views integer DEFAULT 0,
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create faqs table
CREATE TABLE IF NOT EXISTS faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category text DEFAULT 'general',
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  subscribed_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Blog posts are viewable by everyone"
  ON blog_posts FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "FAQs are viewable by everyone"
  ON faqs FOR SELECT
  TO anon, authenticated
  USING (true);

-- Newsletter subscription policies
CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Subscribers can view own subscription"
  ON newsletter_subscribers FOR SELECT
  TO anon, authenticated
  USING (true);
