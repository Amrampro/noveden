// api/src/routes/admin/financeRoutes.js
import { Router } from "express";
import { listFinance } from "../../controllers/admin/financeController.js";

const router = Router();

// GET /api/admin/finance
router.get("/", listFinance);

export default router;
