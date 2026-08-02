import express from "express";
import { register, login } from "../controllers/authController.js";
import { reqAuth } from "../middleware/authMiddleware.js";
import { registerValidation, loginValidation } from "../middleware/validationMiddleware.js";

const router=express.Router();

router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.get("/profile", reqAuth, (req, res) => {
    res.json(req.user);
});
export default router;