// api/src/routes/products.js
import { Router } from "express";
import * as ProductsController from "../controllers/productsController.js";

const router = Router();

// Public
router.get("/", ProductsController.getAllProducts);
router.get("/slug/:slug", ProductsController.getProductBySlug);

// Admin CRUD (later you will protect with auth middleware + isAdmin)
router.get("/admin/:id", ProductsController.getProductByIdAdmin);
router.post("/admin", ProductsController.createProduct);
router.put("/admin/:id", ProductsController.updateProduct);
router.delete("/admin/:id", ProductsController.deleteProduct);

export default router;
