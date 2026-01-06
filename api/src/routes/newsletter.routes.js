// api/src/routes/newsletter.routes.js
import { Router } from "express";
import {
  subscribeNewsletter,
  adminListNewsletterSubscribers,
  adminDeleteNewsletterSubscriber,
} from "../controllers/newsletterController.js";

import { authenticateToken } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

// Public
router.post("/", subscribeNewsletter);

// Admin
router.get(
  "/",
  // authenticateToken,
  // requireAdmin,
  adminListNewsletterSubscribers
);

router.delete(
  "/:id",
  // authenticateToken,
  // requireAdmin,
  adminDeleteNewsletterSubscriber
);

export default router;
