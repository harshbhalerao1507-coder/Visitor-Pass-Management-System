import express from "express";
import { getEmployees } from "../controllers/userController.js";
import { reqAuth } from "../middleware/authMiddleware.js";
const router = express.Router();
router.get("/employees", reqAuth, getEmployees);
export default router;
