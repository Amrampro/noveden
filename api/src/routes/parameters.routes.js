// api/src/routes/parameters.routes.js
import { Router } from "express";
import {
  getParameters,
  upsertParameters,
} from "../controllers/parametersController.js";
// import { authMiddleware } from "../middlewares/auth.middleware.js";
// import { adminOnly } from "../middlewares/admin.middleware.js"; // si tu l’as

const router = Router();

router.get("/", getParameters);
router.put("/", upsertParameters);

export default router;
