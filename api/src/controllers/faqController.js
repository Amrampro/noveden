import { query } from '../config/database.js';

export const getAllFAQs = async (req, res) => {
  try {
    const { category } = req.query;

    let sql = 'SELECT * FROM faqs WHERE 1=1';
    const params = [];

    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }

    sql += ' ORDER BY display_order, created_at';

    const faqs = await query(sql, params);

    res.json({ faqs });
  } catch (error) {
    console.error('Get FAQs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
