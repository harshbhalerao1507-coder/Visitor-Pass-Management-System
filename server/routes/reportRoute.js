import express from "express";
import { getReportsData } from "../controllers/reportController.js";
import { reqAuth } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", reqAuth, requireRole("Admin", "Security", "Employee"), getReportsData);

export default router;
