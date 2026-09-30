import { body } from "express-validator";

const registerValidator = [
    body("firstName")
        .trim()
        .notEmpty()
        .withMessage("First name is required")
        .isLength({ min: 2, max: 50 })
        .withMessage("First name must be between 2 and 50 characters"),

    body("lastName")
        .trim()
        .notEmpty()
        .withMessage("Last name is required")
        .isLength({ max: 50 })
        .withMessage("Last name cannot exceed 50 characters"),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please provide a valid email")
        .normalizeEmail(),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters"),
];

const loginValidator = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please provide a valid email")
        .normalizeEmail(),

    body("password")
        .notEmpty()
        .withMessage("Password is required"),
];

export {
    registerValidator,
    loginValidator,
};