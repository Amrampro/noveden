import { Router } from "express";
import * as StripeWebhookController from "../controllers/stripeWebhook.controller.js";

const router = Router();

// POST /api/v1/webhooks/stripe
router.post("/stripe", StripeWebhookController.stripeWebhook);

export default router;
