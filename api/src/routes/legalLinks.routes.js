// api/src/routes/legalLinks.routes.js
import { Router } from "express";
import * as LegalLinksController from "../controllers/legalLinksController.js";
// import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// Public
router.get("/", LegalLinksController.getLegalLinks);
router.get("/:id", LegalLinksController.getLegalLinkById);

// Admin CRUD
// router.use(authMiddleware);
router.post("/", LegalLinksController.createLegalLink);
router.put("/:id", LegalLinksController.updateLegalLink);
router.delete("/:id", LegalLinksController.deleteLegalLink);

export default router;
