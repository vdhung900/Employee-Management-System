const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const notificationController = require("../controllers/notificationController");

// Validation middleware
const validateNotification = [
  body("title").notEmpty().withMessage("Title is required"),
  body("content").notEmpty().withMessage("Content is required"),
  body("target").isIn(["all", "department"]).withMessage("Invalid target type"),
];

// Routes
router.post(
  "/",
  validateNotification,
  notificationController.createNotification
);
router.get("/", notificationController.getAllNotifications);
router.get("/:id", notificationController.getNotificationById);
router.put(
  "/:id",
  validateNotification,
  notificationController.updateNotification
);
router.delete("/:id", notificationController.deleteNotification);

module.exports = router;
