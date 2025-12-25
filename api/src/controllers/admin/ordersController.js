import { query } from '../../config/database.js';

export const getAllOrders = async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;

    let sql = `
      SELECT o.*, u.email as user_email, u.first_name as user_first_name, u.last_name as user_last_name
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      sql += ' AND o.status = ?';
      params.push(status);
    }

    sql += ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const orders = await query(sql, params);

    for (let order of orders) {
      const items = await query(
        'SELECT * FROM order_items WHERE order_id = ?',
        [order.id]
      );
      order.items = items;
    }

    const countSql = 'SELECT COUNT(*) as total FROM orders';
    const countResult = await query(countSql);

    res.json({
      orders,
      total: countResult[0].total
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const orders = await query(
      `SELECT o.*, u.email as user_email, u.first_name as user_first_name, u.last_name as user_last_name
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       WHERE o.id = ?`,
      [id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orders[0];

    const items = await query(
      'SELECT * FROM order_items WHERE order_id = ?',
      [order.id]
    );

    order.items = items;

    res.json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    await query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);

    const orders = await query('SELECT * FROM orders WHERE id = ?', [id]);

    res.json({
      message: 'Order status updated successfully',
      order: orders[0]
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    await query('DELETE FROM orders WHERE id = ?', [id]);

    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
