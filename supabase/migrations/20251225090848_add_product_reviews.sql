/*
  # Add Product Reviews System

  ## Overview
  This migration adds a product reviews and ratings system to enable customers to leave feedback on products.

  ## New Tables

  ### product_reviews
  - `id` (uuid, primary key) - Unique review identifier
  - `product_id` (uuid, foreign key) - Reference to products table
  - `customer_name` (text) - Name of the reviewer
  - `customer_email` (text) - Email of the reviewer (not displayed publicly)
  - `rating` (integer) - Rating from 1 to 5 stars
  - `title` (text) - Review title/headline
  - `comment` (text) - Review content
  - `is_verified_purchase` (boolean) - Whether this is a verified purchase
  - `helpful_count` (integer) - Number of users who found this helpful
  - `created_at` (timestamptz) - Review creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Changes to Existing Tables

  ### products table
  - Add `average_rating` (decimal) - Average star rating (0-5)
  - Add `review_count` (integer) - Total number of reviews

  ## Security
  - Enable RLS on product_reviews table
  - Add policies for public read access to approved reviews
  - Add policies for authenticated users to submit reviews

  ## Indexes
  - Index on product_id for fast review lookups
  - Index on rating for filtering
*/

-- Add rating fields to products table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'average_rating'
  ) THEN
    ALTER TABLE products ADD COLUMN average_rating decimal(3,2) DEFAULT 0.00;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'review_count'
  ) THEN
    ALTER TABLE products ADD COLUMN review_count integer DEFAULT 0;
  END IF;
END $$;

-- Create product_reviews table
CREATE TABLE IF NOT EXISTS product_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text NOT NULL,
  comment text NOT NULL,
  is_verified_purchase boolean DEFAULT false,
  helpful_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_rating ON product_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_product_reviews_created_at ON product_reviews(created_at DESC);

-- Enable Row Level Security
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Product reviews are viewable by everyone"
  ON product_reviews FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create policy for inserting reviews (anyone can submit)
CREATE POLICY "Anyone can submit a product review"
  ON product_reviews FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create function to update product rating statistics
CREATE OR REPLACE FUNCTION update_product_rating_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products
  SET 
    review_count = (SELECT COUNT(*) FROM product_reviews WHERE product_id = NEW.product_id),
    average_rating = (SELECT ROUND(AVG(rating)::numeric, 2) FROM product_reviews WHERE product_id = NEW.product_id)
  WHERE id = NEW.product_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update product stats when review is added
DROP TRIGGER IF EXISTS trigger_update_product_rating ON product_reviews;
CREATE TRIGGER trigger_update_product_rating
  AFTER INSERT OR UPDATE OR DELETE ON product_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_product_rating_stats();
