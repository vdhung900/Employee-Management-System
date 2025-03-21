const express = require("express");
const router = express.Router();
const {
  backupData,
  getBackupFiles,
  restoreData,
  deleteBackup,
} = require("../controllers/backupController");
const authMiddleware = require("../middlewares/authMiddleware");

// Middleware kiểm tra quyền admin
const checkAdminRole = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res
      .status(403)
      .json({ message: "Access denied. Admin privileges required." });
  }
};

// Tạo backup mới
router.post("/", authMiddleware, checkAdminRole, backupData);

// Lấy danh sách các file backup
router.get("/", authMiddleware, checkAdminRole, getBackupFiles);

// Phục hồi dữ liệu từ file backup
router.post("/restore/:filename", authMiddleware, checkAdminRole, restoreData);

// Xóa file backup
router.delete("/:filename", authMiddleware, checkAdminRole, deleteBackup);

module.exports = router;
