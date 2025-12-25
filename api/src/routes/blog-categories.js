// api/src/routes/blog-categories.js
import { Router } from "express";
import * as BlogCategoriesController from "../controllers/blogCategoriesController.js";

const router = Router();

// Public list
router.get("/", BlogCategoriesController.getBlogCategories);

// Admin CRUD (later you will protect with auth middleware + isAdmin)
router.post("/", BlogCategoriesController.createBlogCategory);
router.put("/:id", BlogCategoriesController.updateBlogCategory);
router.delete("/:id", BlogCategoriesController.deleteBlogCategory);

export default router;
