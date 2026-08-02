import { body, validationResult } from "express-validator";

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map(err => ({
            field: err.path || err.param,
            message: err.msg
        }));
        
        return res.status(400).json({
            success: false,
            error: formattedErrors[0].message,
            errors: formattedErrors
        });
    }
    next();
};

export const registerValidation = [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Valid email format is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("role").optional().isIn(["Admin", "Security", "Employee"]).withMessage("Invalid role"),
    validate
];

export const loginValidation = [
    body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Valid email format is required"),
    body("password").notEmpty().withMessage("Password is required"),
    validate
];

export const visitorValidation = [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Valid email format is required"),
    body("phone").notEmpty().withMessage("Phone is required").isLength({ min: 10, max: 15 }).withMessage("Phone number must be between 10 and 15 digits"),
    body("address").notEmpty().withMessage("Address is required"),
    body("company").notEmpty().withMessage("Company is required"),
    body("idProof").notEmpty().withMessage("ID Proof is required"),
    body("photo").custom((value, { req }) => {
        if (req.file) {
            const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
            if (!validTypes.includes(req.file.mimetype)) {
                throw new Error("Invalid file type. Only JPEG, PNG and WEBP are allowed.");
            }
        }
        return true;
    }),
    validate
];

export const appointmentValidation = [
    body("visitor").notEmpty().withMessage("Visitor ID is required"),
    body("employee").notEmpty().withMessage("Employee ID is required"),
    body("visitDate").notEmpty().withMessage("Appointment Date is required").custom((value) => {
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
            throw new Error("Appointment Date must be a future date");
        }
        return true;
    }),
    body("purpose").notEmpty().withMessage("Purpose is required"),
    validate
];

export const passValidation = [
    body("visitor").notEmpty().withMessage("Visitor ID is required"),
    body("appointment").notEmpty().withMessage("Appointment ID is required"),
    body("validTo").notEmpty().withMessage("Expiry Date is required").custom((value) => {
        const selectedDate = new Date(value);
        if (isNaN(selectedDate.getTime())) {
            throw new Error("Invalid expiry date format");
        }
        return true;
    }),
    body("status").optional().isIn(["Active", "Used", "Expired", "Revoked"]).withMessage("Invalid status"),
    validate
];

export const userValidation = [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Valid email format is required"),
    body("password").optional().isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("role").notEmpty().withMessage("Role is required").isIn(["Admin", "Security", "Employee"]).withMessage("Invalid role"),
    validate
];
