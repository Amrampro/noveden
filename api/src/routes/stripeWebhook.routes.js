import { Router } from "express";
import { stripeWebhook } from "../controllers/stripeWebhook.controller.js";

const router = Router();

// POST /api/webhooks/stripe
router.post("/stripe", stripeWebhook);

export default router;
