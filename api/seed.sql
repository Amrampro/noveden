USE ecommerce_db;

-- =====================================================
-- USERS
-- =====================================================

INSERT INTO users (id, email, password_hash, first_name, last_name, phone, is_admin)
VALUES
('u-admin', 'admin@shop.com', '$2b$10$hashedpassword', 'Admin', 'System', '+320000000', TRUE),
('u-1', 'client1@mail.com', '$2b$10$hashedpassword', 'Sarah', 'Dupont', '+32470000001', FALSE),
('u-2', 'client2@mail.com', '$2b$10$hashedpassword', 'Marc', 'Lebrun', '+32470000002', FALSE);

INSERT INTO user_addresses (id, user_id, first_name, last_name, email, phone, address_line1, town, postal_code, country, is_default)
VALUES
('addr-1', 'u-1', 'Sarah', 'Dupont', 'client1@mail.com', '+32470000001', 'Rue Louise 12', 'Bruxelles', '1000', 'Belgique', TRUE),
('addr-2', 'u-2', 'Marc', 'Lebrun', 'client2@mail.com', '+32470000002', 'Avenue Fonsny 8', 'Bruxelles', '1060', 'Belgique', TRUE);

-- =====================================================
-- PRODUCT CATEGORIES
-- =====================================================

INSERT INTO product_categories (id, name, slug, description, display_order)
VALUES
('pc-1', 'Soins Visage', 'soins-visage', 'Produits pour le visage', 1),
('pc-2', 'Crèmes', 'cremes', 'Crèmes hydratantes', 2),
('pc-3', 'Sérums', 'serums', 'Sérums concentrés', 3),
('pc-4', 'Cheveux', 'cheveux', 'Soins capillaires', 4);

UPDATE product_categories SET parent_id = 'pc-1' WHERE id IN ('pc-2','pc-3');

-- =====================================================
-- PRODUCTS
-- =====================================================

INSERT INTO products (id, name, slug, description, short_description, price, image_url, is_featured, is_new)
VALUES
('p-1', 'Sérum Vitamine C', 'serum-vitamine-c', 'Sérum éclat à la vitamine C', 'Illumine le teint', 45.00,
 'https://images.pexels.com/photos/3018845/pexels-photo-3018845.jpeg', TRUE, TRUE),
('p-2', 'Crème Hydratante', 'creme-hydratante', 'Crème nourrissante visage', 'Hydratation 24h', 38.00,
 'https://images.pexels.com/photos/3018840/pexels-photo-3018840.jpeg', TRUE, FALSE),
('p-3', 'Masque Capillaire', 'masque-capillaire', 'Masque réparateur cheveux secs', 'Cheveux nourris', 29.00,
 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg', FALSE, TRUE);

INSERT INTO product_category_pivot (product_id, category_id)
VALUES
('p-1','pc-1'), ('p-1','pc-3'),
('p-2','pc-1'), ('p-2','pc-2'),
('p-3','pc-4');

-- =====================================================
-- PRODUCT IMAGES
-- =====================================================

INSERT INTO product_images (id, product_id, image_url, is_primary)
VALUES
('img-1','p-1','https://images.pexels.com/photos/3018845/pexels-photo-3018845.jpeg', TRUE),
('img-2','p-2','https://images.pexels.com/photos/3018840/pexels-photo-3018840.jpeg', TRUE),
('img-3','p-3','https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg', TRUE);

-- =====================================================
-- PRODUCT REVIEWS
-- =====================================================

INSERT INTO product_reviews (id, product_id, customer_name, customer_email, rating, title, comment)
VALUES
('r-1','p-1','Sarah Dupont','client1@mail.com',5,'Excellent','Très bon sérum'),
('r-2','p-1','Marc Lebrun','client2@mail.com',4,'Efficace','Résultat visible'),
('r-3','p-2','Sarah Dupont','client1@mail.com',5,'Parfaite','Hydrate très bien');

-- =====================================================
-- BLOG CATEGORIES
-- =====================================================

INSERT INTO blog_categories (id, name, slug, description, display_order)
VALUES
('bc-1','Beauté','beaute','Conseils beauté',1),
('bc-2','Soins Naturels','soins-naturels','Routine naturelle',2),
('bc-3','Conseils Experts','conseils-experts','Astuces professionnelles',3);

UPDATE blog_categories SET parent_id = 'bc-1' WHERE id = 'bc-2';

-- =====================================================
-- BLOG POSTS
-- =====================================================

INSERT INTO blog_posts (id, title, slug, excerpt, content, image_url, published_at)
VALUES
('bp-1','Les bienfaits des soins naturels','bienfaits-soins-naturels',
 'Pourquoi choisir le naturel',
 '<p>Les soins naturels respectent la peau...</p>',
 'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg',
 NOW()),
('bp-2','Routine visage idéale','routine-visage',
 'Routine quotidienne simple',
 '<p>Voici une routine visage efficace...</p>',
 'https://images.pexels.com/photos/3762878/pexels-photo-3762878.jpeg',
 NOW());

INSERT INTO blog_post_category_pivot (blog_post_id, category_id)
VALUES
('bp-1','bc-1'), ('bp-1','bc-2'),
('bp-2','bc-1'), ('bp-2','bc-3');

-- =====================================================
-- COUPONS
-- =====================================================

INSERT INTO coupons (id, code, description, discount_type, discount_value, min_purchase_amount, is_active)
VALUES
('c-1','WELCOME10','10% de réduction nouveaux clients','percentage',10,0,TRUE),
('c-2','LOYAL20','20% clients fidèles','percentage',20,50,TRUE);

UPDATE coupons SET requires_min_orders = 5 WHERE id = 'c-2';

-- =====================================================
-- ORDERS
-- =====================================================

INSERT INTO orders (
    id, user_id, subtotal, discount_amount, total,
    shipping_first_name, shipping_last_name, shipping_email,
    shipping_phone, shipping_address_line1, shipping_town,
    shipping_postal_code, shipping_country
)
VALUES
('o-1','u-1',83.00,8.30,74.70,'Sarah','Dupont','client1@mail.com',
 '+32470000001','Rue Louise 12','Bruxelles','1000','Belgique');

INSERT INTO order_items (id, order_id, product_id, product_name, product_price, quantity, subtotal)
VALUES
('oi-1','o-1','p-1','Sérum Vitamine C',45.00,1,45.00),
('oi-2','o-1','p-2','Crème Hydratante',38.00,1,38.00);

-- =====================================================
-- FAQ
-- =====================================================

INSERT INTO faqs (question, answer, category, display_order)
VALUES
('Comment commander ?','Ajoutez les produits au panier puis payez.','Commandes',1),
('Délais de livraison ?','Livraison sous 2 à 3 jours ouvrés.','Livraison',2),
('Produits naturels ?','Oui, nos produits sont naturels.','Produits',3);

-- =====================================================
-- END OF SEED
-- =====================================================
