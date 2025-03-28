const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const UserController = require("../controllers/UserController");

// Validation middleware
const authValidation = [
  check("username")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail(),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  check("role")
    .optional()
    .isIn(["admin", "employee"])
    .withMessage("Invalid role"),
];

// Authentication routes
router.post("/register", authValidation, UserController.register);

router.post(
  "/login",
  [
    check("username").notEmpty().withMessage("Username is required"),
    check("password").notEmpty().withMessage("Password is required"),
  ],
  UserController.login
);

router.get("/profile", UserController.getUserProfile);

router.post("/refresh", UserController.refreshToken);

router.post("/logout", UserController.logout);

// Admin routes
router.get("/admin/users", UserController.getAllUsers);
router.delete("/admin/users/:id", UserController.deleteUser);

module.exports = router;
