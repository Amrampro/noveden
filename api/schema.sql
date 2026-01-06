-- =====================================================
-- E-Commerce Database Schema for MySQL (FINAL – CLEAN)
-- =====================================================
-- Created: 2025-12-25
-- Database: ecommerce_db
-- =====================================================

CREATE DATABASE IF NOT EXISTS ecommerce_db
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ecommerce_db;

-- =====================================================
-- USERS
-- =====================================================

CREATE TABLE users (
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
) ENGINE=InnoDB;

CREATE TABLE user_addresses (
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
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB;

-- =====================================================
-- PRODUCT CATEGORIES
-- =====================================================

CREATE TABLE product_categories (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    parent_id VARCHAR(36) NULL,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    description TEXT,
    image_url VARCHAR(500),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES product_categories(id) ON DELETE SET NULL,
    INDEX idx_slug (slug)
) ENGINE=InnoDB;

-- =====================================================
-- PRODUCTS
-- =====================================================

CREATE TABLE products (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    short_description TEXT,
    price DECIMAL(10,2) NOT NULL,
    compare_at_price DECIMAL(10,2),
    image_url VARCHAR(500),
    stock_status ENUM('in_stock','limited','out_of_stock') DEFAULT 'in_stock',
    is_featured BOOLEAN DEFAULT FALSE,
    is_new BOOLEAN DEFAULT FALSE,
    ingredients TEXT,
    `usage` TEXT,
    benefits JSON,
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    review_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_slug (slug),
    INDEX idx_stock (stock_status)
) ENGINE=InnoDB;

CREATE TABLE product_category_pivot (
    product_id VARCHAR(36) NOT NULL,
    category_id VARCHAR(36) NOT NULL,
    PRIMARY KEY (product_id, category_id),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES product_categories(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE product_images (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    product_id VARCHAR(36) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    display_order INT DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE product_reviews (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    product_id VARCHAR(36) NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    title VARCHAR(200),
    comment TEXT,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    helpful_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =====================================================
-- ORDERS
-- =====================================================

CREATE TABLE IF NOT EXISTS orders (
  id              VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id         BIGINT UNSIGNED NOT NULL,
  status          ENUM('pending_payment','paid','processing','shipped','delivered','cancelled','refunded')
                  NOT NULL DEFAULT 'pending_payment',

  currency        VARCHAR(10) NOT NULL DEFAULT 'EUR',
  subtotal_amount INT NOT NULL DEFAULT 0,
  discount_amount INT NOT NULL DEFAULT 0,
  shipping_amount INT NOT NULL DEFAULT 0,
  total_amount    INT NOT NULL DEFAULT 0,

  coupon_code     VARCHAR(50) NULL,

  shipping_method ENUM('mondial_relay','home_delivery') NULL,
  shipping_status ENUM('not_set','label_created','in_transit','delivered','returned') NOT NULL DEFAULT 'not_set',

  shipping_tracking_number VARCHAR(80) NULL,
  shipping_tracking_url    VARCHAR(255) NULL,

  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_orders_user (user_id),
  INDEX idx_orders_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS order_items (
  id          VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  order_id    VARCHAR(36) NOT NULL,
  product_id  VARCHAR(36) NOT NULL,

  product_name VARCHAR(255) NOT NULL,
  unit_price   INT NOT NULL,
  quantity     INT NOT NULL DEFAULT 1,
  line_total   INT NOT NULL,

  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_order_items_order (order_id),
  INDEX idx_order_items_product (product_id),

  CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS order_addresses (
  id          VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  order_id    VARCHAR(36) NOT NULL UNIQUE,

  full_name   VARCHAR(191) NOT NULL,
  email       VARCHAR(191) NOT NULL,
  phone       VARCHAR(50)  NOT NULL,

  country     VARCHAR(2)   NOT NULL,
  city        VARCHAR(120) NOT NULL,
  postal_code VARCHAR(30)  NOT NULL,
  address1    VARCHAR(255) NOT NULL,
  address2    VARCHAR(255) NULL,

  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_order_addresses_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS order_payments (
  id                  VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  order_id            VARCHAR(36) NOT NULL,

  provider            ENUM('stripe') NOT NULL DEFAULT 'stripe',
  status              ENUM('requires_payment','processing','succeeded','failed','refunded') NOT NULL DEFAULT 'requires_payment',

  stripe_payment_intent_id VARCHAR(100) NULL,
  stripe_charge_id         VARCHAR(100) NULL,

  amount              INT NOT NULL,
  currency            VARCHAR(10) NOT NULL DEFAULT 'EUR',

  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE KEY uniq_order_payment (order_id),
  INDEX idx_payment_intent (stripe_payment_intent_id),

  CONSTRAINT fk_order_payments_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE order_payments ADD COLUMN stripe_checkout_session_id VARCHAR(100) NULL;
CREATE INDEX idx_checkout_session ON order_payments(stripe_checkout_session_id);


CREATE TABLE IF NOT EXISTS order_shipping (
  id              VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  order_id        VARCHAR(36) NOT NULL UNIQUE,

  provider        ENUM('mondial_relay') NOT NULL DEFAULT 'mondial_relay',
  relay_point_id  VARCHAR(80) NULL,
  relay_point_name VARCHAR(191) NULL,
  relay_point_address TEXT NULL,

  label_url       VARCHAR(255) NULL,
  tracking_number VARCHAR(80) NULL,
  tracking_url    VARCHAR(255) NULL,

  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_order_shipping_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =====================================================
-- COUPONS
-- =====================================================

CREATE TABLE coupons (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    discount_type ENUM('percentage','fixed') NOT NULL,
    discount_value DECIMAL(10,2) NOT NULL,
    min_purchase_amount DECIMAL(10,2) DEFAULT 0,
    max_discount_amount DECIMAL(10,2),
    valid_from TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valid_until TIMESTAMP NULL,
    usage_limit_per_user INT DEFAULT 1,
    total_usage_limit INT,
    current_usage_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    requires_first_order BOOLEAN DEFAULT FALSE,
    requires_min_orders INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE coupon_usage (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    coupon_id VARCHAR(36),
    user_id VARCHAR(36),
    order_id VARCHAR(36),
    discount_applied DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
) ENGINE=InnoDB;

ALTER TABLE orders
ADD CONSTRAINT fk_orders_coupon
FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE SET NULL;

-- =====================================================
-- BLOG CATEGORIES & POSTS (MANY TO MANY)
-- =====================================================

CREATE TABLE blog_categories (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    parent_id VARCHAR(36),
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    description TEXT,
    image_url VARCHAR(500),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES blog_categories(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE blog_posts (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    excerpt TEXT,
    content LONGTEXT NOT NULL,
    image_url VARCHAR(500),
    reading_time INT DEFAULT 5,
    views INT DEFAULT 0,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

ALTER TABLE blog_posts
  MODIFY COLUMN content MEDIUMTEXT NOT NULL;


CREATE TABLE blog_post_category_pivot (
    blog_post_id VARCHAR(36) NOT NULL,
    category_id VARCHAR(36) NOT NULL,
    PRIMARY KEY (blog_post_id, category_id),
    FOREIGN KEY (blog_post_id) REFERENCES blog_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES blog_categories(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =====================================================
-- FAQ
-- =====================================================

CREATE TABLE faqs (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    question VARCHAR(500),
    answer TEXT,
    category VARCHAR(100),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE banners (
    id              CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    page_name       ENUM('shop', 'home', 'about', 'faqs', 'contact') NOT NULL,
        title           VARCHAR(255) NULL,
    subtitle        TEXT NULL,
    button          VARCHAR(100) NULL,               -- texte du bouton
    link            VARCHAR(500) NULL,               -- URL du bouton
    background_img  VARCHAR(500) NULL,               -- URL ou path image

    is_active       TINYINT(1) NOT NULL DEFAULT 1,
    display_order   INT NOT NULL DEFAULT 0,

    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_page_name (page_name),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE parameters (
    id                  CHAR(36) PRIMARY KEY DEFAULT (UUID()),

    promotional_text    TEXT NULL,

    home_text           TEXT NULL,
    story               TEXT NULL,
    mission             TEXT NULL,
    vision              TEXT NULL,
    expertise           TEXT NULL,

    name                VARCHAR(255) NULL,           -- nom entreprise
    email               VARCHAR(191) NULL,
    address             VARCHAR(255) NULL,
    phone               VARCHAR(50) NULL,
    enterprise_number   VARCHAR(100) NULL,

    facebook_link       VARCHAR(255) NULL,
    instagram_link      VARCHAR(255) NULL,
    twitter_link        VARCHAR(255) NULL,
    whatsapp_link       VARCHAR(255) NULL,

    logo_navbar        VARCHAR(500) NULL,           -- URL ou path image
    logo_footer        VARCHAR(500) NULL,           -- URL ou path image

    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE legal_links (
    id              CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name            VARCHAR(255) NOT NULL,       -- ex: Mentions légales, CGV
    file            VARCHAR(500) NOT NULL,       -- URL ou path fichier

    display_order   INT NOT NULL DEFAULT 0,
    is_active       TINYINT(1) NOT NULL DEFAULT 1,

    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- api/database/schema.sql
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  email VARCHAR(191) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_newsletter_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =====================================================
-- TRIGGERS
-- =====================================================

DELIMITER //
CREATE TRIGGER update_product_rating
AFTER INSERT ON product_reviews
FOR EACH ROW
BEGIN
    UPDATE products
    SET average_rating = (
        SELECT AVG(rating) FROM product_reviews WHERE product_id = NEW.product_id
    ),
    review_count = (
        SELECT COUNT(*) FROM product_reviews WHERE product_id = NEW.product_id
    )
    WHERE id = NEW.product_id;
END//
DELIMITER ;

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
-- END
-- =====================================================
