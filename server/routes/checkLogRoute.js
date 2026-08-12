import express from "express";
import { checkIn, checkOut, getAllCheckLogs } from "../controllers/checklogController.js";
import { reqAuth } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
    "/",
    reqAuth,
    requireRole("Admin", "Security"),
    getAllCheckLogs
);

router.post(
    "/checkin",
    reqAuth,
    requireRole("Admin", "Security"),
    checkIn
);

router.post(
    "/checkout",
    reqAuth,
    requireRole("Admin", "Security"),
    checkOut
);

export default router;