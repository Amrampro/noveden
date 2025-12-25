import express from 'express';
import { authenticateToken, requireAdmin } from '../../middleware/auth.js';

import * as usersController from '../../controllers/admin/usersController.js';
import * as productsController from '../../controllers/admin/productsController.js';
import * as couponsController from '../../controllers/admin/couponsController.js';
import * as blogController from '../../controllers/admin/blogController.js';
import * as faqController from '../../controllers/admin/faqController.js';
import * as ordersController from '../../controllers/admin/ordersController.js';

const router = express.Router();

router.use(authenticateToken);
router.use(requireAdmin);

router.get('/users', usersController.getAllUsers);
router.get('/users/:id', usersController.getUserById);
router.put('/users/:id', usersController.updateUser);
router.delete('/users/:id', usersController.deleteUser);

router.get('/products', productsController.getAllProducts);
router.post('/products', productsController.createProduct);
router.put('/products/:id', productsController.updateProduct);
router.delete('/products/:id', productsController.deleteProduct);

router.get('/coupons', couponsController.getAllCoupons);
router.post('/coupons', couponsController.createCoupon);
router.put('/coupons/:id', couponsController.updateCoupon);
router.delete('/coupons/:id', couponsController.deleteCoupon);

router.get('/blog', blogController.getAllPosts);
router.post('/blog', blogController.createPost);
router.put('/blog/:id', blogController.updatePost);
router.delete('/blog/:id', blogController.deletePost);

router.get('/faq', faqController.getAllFAQs);
router.post('/faq', faqController.createFAQ);
router.put('/faq/:id', faqController.updateFAQ);
router.delete('/faq/:id', faqController.deleteFAQ);

router.get('/orders', ordersController.getAllOrders);
router.get('/orders/:id', ordersController.getOrderById);
router.put('/orders/:id/status', ordersController.updateOrderStatus);
router.delete('/orders/:id', ordersController.deleteOrder);

export default router;
