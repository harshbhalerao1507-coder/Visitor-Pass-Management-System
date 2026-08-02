import express from "express";
import {
    getVisitors,
    createVisitor,
    getVisitorById,
    updateVisitorById,
    deleteVisitorById
} from "../controllers/visitorController.js";
import { reqAuth } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import { visitorValidation } from "../middleware/validationMiddleware.js";

const router = express.Router();
router.get("/", reqAuth, requireRole("Admin", "Security"), getVisitors);
router.post("/",  upload.single("photo"), reqAuth, requireRole("Admin", "Security", "Employee"), visitorValidation, createVisitor);
router.get("/:id", reqAuth, requireRole("Admin", "Security", "Employee"), getVisitorById);
router.patch("/:id", reqAuth, requireRole("Admin", "Security"), visitorValidation, updateVisitorById);
router.delete("/:id", reqAuth, requireRole("Admin"), deleteVisitorById);
export default router;