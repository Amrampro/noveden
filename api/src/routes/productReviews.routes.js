// api/src/routes/productReviews.routes.js
import { Router } from "express";
// import { authMiddleware } from "../middlewares/auth.middleware.js";

import {
  listProductReviews,
  createProductReview,
  adminListReviews,
  adminDeleteReview,
} from "../controllers/productReviewsController.js";

const router = Router();

/**
 * Public
 * GET  /api/v1/products/:id/reviews
 * POST /api/v1/products/:id/reviews
 */
router.get("/products/:id/reviews", listProductReviews);
router.post("/products/:id/reviews", createProductReview);

/**
 * Admin (protected)
 * GET    /api/v1/admin/product-reviews
 * DELETE /api/v1/admin/product-reviews/:id
 */
// router.get("/admin/product-reviews", authMiddleware, adminListReviews);
// router.delete("/admin/product-reviews/:id", authMiddleware, adminDeleteReview);

router.get("/admin/product-reviews", adminListReviews);
router.delete("/admin/product-reviews/:id", adminDeleteReview);

export default router;
