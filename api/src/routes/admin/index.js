// api/src/routes/admin/index.js
import { Router } from "express";
import blogCategoriesRoutes from "../blog-categories.js";
import productCategoriesRoutes from "../product-categories.js";

const router = Router();

// Admin namespaces (later you will protect router with auth middleware + isAdmin)
router.use("/blog-categories", blogCategoriesRoutes);
router.use("/product-categories", productCategoriesRoutes);

export default router;
