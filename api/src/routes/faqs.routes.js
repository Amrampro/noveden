// api/src/routes/faqs.routes.js
import { Router } from "express";
import * as FaqsController from "../controllers/faqsController.js";
// import { authMiddleware } from "../middlewares/auth.middleware.js"; // if you already have it

const router = Router();

// Public
router.get("/", FaqsController.getFaqs);
router.get("/:id", FaqsController.getFaqById);

// Admin (protect if you want)
// router.post("/admin", authMiddleware, FaqsController.createFaq);
// router.put("/admin/:id", authMiddleware, FaqsController.updateFaq);
// router.delete("/admin/:id", authMiddleware, FaqsController.deleteFaq);
router.post("/admin", FaqsController.createFaq);
router.put("/admin/:id", FaqsController.updateFaq);
router.delete("/admin/:id", FaqsController.deleteFaq);

export default router;
