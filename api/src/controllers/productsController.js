import { query } from '../config/database.js';

export const getAllProducts = async (req, res) => {
  try {
    const { category, featured, search, limit = 50, offset = 0 } = req.query;

    let sql = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (category) {
      sql += ' AND c.slug = ?';
      params.push(category);
    }

    if (featured === 'true') {
      sql += ' AND p.is_featured = 1';
    }

    if (search) {
      sql += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const products = await query(sql, params);

    for (let product of products) {
      if (product.benefits && typeof product.benefits === 'string') {
        try {
          product.benefits = JSON.parse(product.benefits);
        } catch (e) {
          product.benefits = [];
        }
      }
    }

    res.json({ products });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const products = await query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.slug = ?`,
      [slug]
    );

    if (products.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = products[0];

    if (product.benefits && typeof product.benefits === 'string') {
      try {
        product.benefits = JSON.parse(product.benefits);
      } catch (e) {
        product.benefits = [];
      }
    }

    const images = await query(
      'SELECT * FROM product_images WHERE product_id = ? ORDER BY display_order',
      [product.id]
    );

    const reviews = await query(
      'SELECT * FROM product_reviews WHERE product_id = ? ORDER BY created_at DESC LIMIT 10',
      [product.id]
    );

    product.images = images;
    product.reviews = reviews;

    res.json({ product });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await query(
      'SELECT * FROM categories ORDER BY display_order, name'
    );

    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
