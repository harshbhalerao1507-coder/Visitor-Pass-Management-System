import express from "express";
import {
    getAppointments,
    createAppointment,
    getAppointmentById,
    updateAppointmentById,
    deleteAppointmentById
} from "../controllers/appointmentController.js";
import { reqAuth } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import { appointmentValidation } from "../middleware/validationMiddleware.js";

const router = express.Router();
router.get(
    "/",
    reqAuth,
    requireRole("Admin", "Security", "Employee"),
    getAppointments
);
router.post(
    "/",
    reqAuth,
    requireRole("Admin", "Security", "Employee"),
    appointmentValidation,
    createAppointment
);
router.get(
    "/:id",
    reqAuth,
    requireRole("Admin", "Security", "Employee"),
    getAppointmentById
);
router.patch(
    "/:id",
    reqAuth,
    requireRole("Admin", "Security", "Employee"),
    appointmentValidation,
    updateAppointmentById
);
router.delete(
    "/:id",
    reqAuth,
    requireRole("Admin"),
    deleteAppointmentById
);
export default router;