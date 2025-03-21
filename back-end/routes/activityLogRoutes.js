const express = require("express");
const router = express.Router();
const {
  getUserActivities,
  getAllActivities,
} = require("../controllers/activityLogController");
const authMiddleware = require("../middlewares/authMiddleware");

// Lấy lịch sử hoạt động của một user cụ thể
router.get("/user/:userId", authMiddleware, getUserActivities);

// Lấy tất cả lịch sử hoạt động (chỉ admin mới có quyền)
router.get("/", authMiddleware, getAllActivities);

module.exports = router;
