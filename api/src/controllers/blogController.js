import { query } from '../config/database.js';

export const getAllPosts = async (req, res) => {
  try {
    const { category, limit = 20, offset = 0 } = req.query;

    let sql = 'SELECT * FROM blog_posts WHERE published_at IS NOT NULL';
    const params = [];

    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }

    sql += ' ORDER BY published_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const posts = await query(sql, params);

    res.json({ posts });
  } catch (error) {
    console.error('Get blog posts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const posts = await query(
      'SELECT * FROM blog_posts WHERE slug = ? AND published_at IS NOT NULL',
      [slug]
    );

    if (posts.length === 0) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    await query(
      'UPDATE blog_posts SET views = views + 1 WHERE id = ?',
      [posts[0].id]
    );

    res.json({ post: posts[0] });
  } catch (error) {
    console.error('Get blog post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
