import express from 'express';
import { getAllProducts, getProductBySlug, getCategories } from '../controllers/productsController.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/categories', getCategories);
router.get('/:slug', getProductBySlug);

export default router;
