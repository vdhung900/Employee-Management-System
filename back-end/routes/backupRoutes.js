const express = require("express");
const router = express.Router();
const {
  backupData,
  getBackupFiles,
  restoreData,
  deleteBackup,
} = require("../controllers/backupController");

// Tạo backup mới
router.post("/", backupData);

// Lấy danh sách các file backup
router.get("/", getBackupFiles);

// Phục hồi dữ liệu từ file backup
router.post("/restore/:filename", restoreData);

// Xóa file backup
router.delete("/:filename", deleteBackup);

module.exports = router;
