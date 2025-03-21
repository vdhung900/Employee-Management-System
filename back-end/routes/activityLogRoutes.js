const express = require("express");
const router = express.Router();
const {
  getUserActivities,
  getAllActivities,
} = require("../controllers/activityLogController");

// Lấy lịch sử hoạt động của một user cụ thể
router.get("/user/:userId", getUserActivities);

// Lấy tất cả lịch sử hoạt động (chỉ admin mới có quyền)
router.get("/",  getAllActivities);

module.exports = router;
