import express from "express";
import { getEmployees } from "../controllers/userController.js";
import { reqAuth } from "../middleware/authMiddleware.js";
import { userValidation } from "../middleware/validationMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();
router.get("/employees", reqAuth, requireRole("Admin", "Security", "Employee"), getEmployees);
export default router;
