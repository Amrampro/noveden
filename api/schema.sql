-- =====================================================
-- E-Commerce Database Schema for MySQL
-- =====================================================
-- Created: 2025-12-25
-- Database: ecommerce_db
-- Description: Complete schema for e-commerce platform
--              with user management, products, orders,
--              coupons, blog, and FAQ system
-- =====================================================

-- Create database
CREATE DATABASE IF NOT EXISTS ecommerce_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ecommerce_db;

-- =====================================================
-- USER MANAGEMENT TABLES
-- =====================================================

-- Users table (authentication and basic info)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL DEFAULT '',
    last_name VARCHAR(100) NOT NULL DEFAULT '',
    phone VARCHAR(20) DEFAULT '',
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_is_admin (is_admin)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User addresses table
CREATE TABLE IF NOT EXISTS user_addresses (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255) DEFAULT '',
    town VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_default (user_id, is_default)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- PRODUCT CATALOG TABLES
-- =====================================================

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    image_url VARCHAR(500),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_slug (slug),
    INDEX idx_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    short_description TEXT,
    price DECIMAL(10,2) NOT NULL,
    compare_at_price DECIMAL(10,2),
    image_url VARCHAR(500),
    category_id VARCHAR(36),
    stock_status ENUM('in_stock', 'limited', 'out_of_stock') DEFAULT 'in_stock',
    is_featured BOOLEAN DEFAULT FALSE,
    is_new BOOLEAN DEFAULT FALSE,
    ingredients TEXT,
    `usage` TEXT,
    benefits JSON,
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    review_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_slug (slug),
    INDEX idx_category (category_id),
    INDEX idx_featured (is_featured),
    INDEX idx_stock (stock_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Product images table
CREATE TABLE IF NOT EXISTS product_images (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    product_id VARCHAR(36) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    display_order INT DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product_id (product_id),
    INDEX idx_display_order (product_id, display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Product reviews table
CREATE TABLE IF NOT EXISTS product_reviews (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    product_id VARCHAR(36) NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title VARCHAR(200),
    comment TEXT,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    helpful_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product_id (product_id),
    INDEX idx_rating (product_id, rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- ORDER MANAGEMENT TABLES
-- =====================================================

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36),
    order_number VARCHAR(50) NOT NULL UNIQUE,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    subtotal DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    total DECIMAL(10,2) NOT NULL,
    coupon_id VARCHAR(36),
    shipping_first_name VARCHAR(100) NOT NULL,
    shipping_last_name VARCHAR(100) NOT NULL,
    shipping_email VARCHAR(255) NOT NULL,
    shipping_phone VARCHAR(20) NOT NULL,
    shipping_address_line1 VARCHAR(255) NOT NULL,
    shipping_address_line2 VARCHAR(255) DEFAULT '',
    shipping_town VARCHAR(100) NOT NULL,
    shipping_postal_code VARCHAR(20) NOT NULL,
    shipping_country VARCHAR(100) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_order_number (order_number),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    order_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(36),
    product_name VARCHAR(255) NOT NULL,
    product_price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    subtotal DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- COUPON SYSTEM TABLES
-- =====================================================

-- Coupons table
CREATE TABLE IF NOT EXISTS coupons (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    discount_type ENUM('percentage', 'fixed') NOT NULL,
    discount_value DECIMAL(10,2) NOT NULL CHECK (discount_value >= 0),
    min_purchase_amount DECIMAL(10,2) DEFAULT 0.00,
    max_discount_amount DECIMAL(10,2),
    valid_from TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valid_until TIMESTAMP NULL,
    usage_limit_per_user INT DEFAULT 1 CHECK (usage_limit_per_user > 0),
    total_usage_limit INT,
    current_usage_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    requires_first_order BOOLEAN DEFAULT FALSE,
    requires_min_orders INT DEFAULT 0 CHECK (requires_min_orders >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_is_active (is_active),
    INDEX idx_valid_dates (valid_from, valid_until)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Coupon usage tracking table
CREATE TABLE IF NOT EXISTS coupon_usage (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    coupon_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    order_id VARCHAR(36),
    discount_applied DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
    UNIQUE KEY unique_coupon_order (coupon_id, user_id, order_id),
    INDEX idx_coupon_id (coupon_id),
    INDEX idx_user_id (user_id),
    INDEX idx_order_id (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add foreign key for orders.coupon_id
ALTER TABLE orders ADD CONSTRAINT fk_orders_coupon
    FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE SET NULL;

-- =====================================================
-- BLOG SYSTEM TABLES
-- =====================================================

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    excerpt TEXT,
    content LONGTEXT NOT NULL,
    image_url VARCHAR(500),
    category VARCHAR(100),
    reading_time INT DEFAULT 5,
    views INT DEFAULT 0,
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_slug (slug),
    INDEX idx_category (category),
    INDEX idx_published_at (published_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- FAQ SYSTEM TABLE
-- =====================================================

-- FAQs table
CREATE TABLE IF NOT EXISTS faqs (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    question VARCHAR(500) NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- SAMPLE DATA INSERTS
-- =====================================================

-- Insert sample categories
INSERT INTO categories (id, name, slug, description, image_url, display_order) VALUES
('cat-1', 'Soins du Visage', 'soins-visage', 'Découvrez notre collection de soins pour le visage', 'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=800', 1),
('cat-2', 'Soins du Corps', 'soins-corps', 'Prenez soin de votre corps avec nos produits naturels', 'https://images.pexels.com/photos/3738386/pexels-photo-3738386.jpeg?auto=compress&cs=tinysrgb&w=800', 2),
('cat-3', 'Soins des Cheveux', 'soins-cheveux', 'Des cheveux sains et brillants naturellement', 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=800', 3);

-- Insert sample products
INSERT INTO products (id, name, slug, description, short_description, price, compare_at_price, image_url, category_id, stock_status, is_featured, is_new, ingredients, `usage`, benefits, average_rating, review_count) VALUES
('prod-1', 'Sérum Visage Éclat Bio', 'serum-visage-eclat-bio', 'Un sérum révolutionnaire enrichi en vitamine C naturelle et acide hyaluronique...', 'Illumine et hydrate votre peau en profondeur', 45.00, 55.00, 'https://images.pexels.com/photos/3018845/pexels-photo-3018845.jpeg?auto=compress&cs=tinysrgb&w=600', 'cat-1', 'in_stock', TRUE, TRUE, 'Vitamine C naturelle, Acide hyaluronique, Huile de jojoba bio', 'Appliquer 2-3 gouttes sur peau propre matin et soir', '["Illumine le teint", "Hydrate en profondeur", "Réduit les taches"]', 4.8, 156),
('prod-2', 'Crème Hydratante Visage', 'creme-hydratante-visage', 'Une crème onctueuse qui nourrit et protège votre peau...', 'Hydratation intense 24h', 38.00, NULL, 'https://images.pexels.com/photos/3018840/pexels-photo-3018840.jpeg?auto=compress&cs=tinysrgb&w=600', 'cat-1', 'in_stock', TRUE, FALSE, 'Beurre de karité, Aloe vera, Huile d\'amande douce', 'Appliquer matin et soir sur peau propre', '["Hydrate 24h", "Apaise la peau", "Texture légère"]', 4.6, 203);

-- Insert sample admin user (password: admin123)
-- Note: In production, use proper password hashing with bcrypt
INSERT INTO users (id, email, password_hash, first_name, last_name, is_admin) VALUES
('admin-1', 'admin@example.com', '$2b$10$YourHashedPasswordHere', 'Admin', 'User', TRUE);

-- Insert sample coupons
INSERT INTO coupons (id, code, description, discount_type, discount_value, min_purchase_amount, requires_first_order, is_active) VALUES
('coup-1', 'WELCOME10', 'Réduction de 10% pour les nouveaux clients', 'percentage', 10.00, 0.00, TRUE, TRUE),
('coup-2', 'LOYAL20', 'Réduction de 20% pour clients fidèles (5+ commandes)', 'percentage', 20.00, 50.00, FALSE, TRUE);

UPDATE coupons SET requires_min_orders = 5 WHERE code = 'LOYAL20';

-- Insert sample FAQs
INSERT INTO faqs (question, answer, category, display_order) VALUES
('Comment passer une commande ?', 'Pour passer une commande, ajoutez les produits à votre panier, puis cliquez sur "Procéder au paiement". Vous devrez créer un compte ou vous connecter.', 'Commandes', 1),
('Quels sont les délais de livraison ?', 'Nous livrons en Belgique sous 2-3 jours ouvrés. La livraison est gratuite à partir de 65€ d\'achat.', 'Livraison', 2),
('Puis-je utiliser plusieurs codes promo ?', 'Non, un seul code promo peut être utilisé par commande.', 'Promotions', 3);

-- Insert sample blog post
INSERT INTO blog_posts (id, title, slug, excerpt, content, image_url, category, reading_time, published_at) VALUES
('blog-1', 'Les Bienfaits des Soins Naturels', 'bienfaits-soins-naturels', 'Découvrez pourquoi les soins naturels sont essentiels pour votre peau...', '<p>Les soins naturels sont de plus en plus populaires...</p>', 'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=800', 'Beauté', 5, NOW());

-- =====================================================
-- STORED PROCEDURES AND TRIGGERS
-- =====================================================

-- Trigger to update product average rating
DELIMITER //
CREATE TRIGGER update_product_rating
AFTER INSERT ON product_reviews
FOR EACH ROW
BEGIN
    UPDATE products
    SET
        average_rating = (
            SELECT AVG(rating)
            FROM product_reviews
            WHERE product_id = NEW.product_id
        ),
        review_count = (
            SELECT COUNT(*)
            FROM product_reviews
            WHERE product_id = NEW.product_id
        )
    WHERE id = NEW.product_id;
END//
DELIMITER ;

-- Trigger to generate order number
DELIMITER //
CREATE TRIGGER generate_order_number
BEFORE INSERT ON orders
FOR EACH ROW
BEGIN
    DECLARE counter INT;
    DECLARE date_part VARCHAR(8);

    SET date_part = DATE_FORMAT(CURDATE(), '%Y%m%d');

    SELECT COUNT(*) + 1 INTO counter
    FROM orders
    WHERE order_number LIKE CONCAT('ORD-', date_part, '-%');

    SET NEW.order_number = CONCAT('ORD-', date_part, '-', LPAD(counter, 5, '0'));
END//
DELIMITER ;

-- =====================================================
-- END OF SCHEMA
-- =====================================================
