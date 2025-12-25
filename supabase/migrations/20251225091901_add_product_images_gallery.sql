/*
  # Add Product Images Gallery

  ## Overview
  This migration adds support for multiple images per product with an image gallery system.

  ## New Tables

  ### product_images
  - `id` (uuid, primary key) - Unique image identifier
  - `product_id` (uuid, foreign key) - Reference to products table
  - `image_url` (text) - Image URL
  - `alt_text` (text) - Image alt text for accessibility
  - `display_order` (integer) - Order for displaying images
  - `is_primary` (boolean) - Whether this is the primary/featured image
  - `created_at` (timestamptz) - Creation timestamp

  ## Security
  - Enable RLS on product_images table
  - Add policies for public read access

  ## Indexes
  - Index on product_id for fast image lookups
  - Index on display_order for sorting
*/

-- Create product_images table
CREATE TABLE IF NOT EXISTS product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  image_url text NOT NULL,
  alt_text text DEFAULT '',
  display_order integer DEFAULT 0,
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_display_order ON product_images(display_order);
CREATE INDEX IF NOT EXISTS idx_product_images_is_primary ON product_images(is_primary);

-- Enable Row Level Security
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Product images are viewable by everyone"
  ON product_images FOR SELECT
  TO anon, authenticated
  USING (true);
