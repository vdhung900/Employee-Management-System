const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");

// Route này phải có quyền admin mới được vào
router.get("/", verifyToken, (req, res) => {
  res.json({ message: "Bạn đã truy cập route bảo vệ!" });
});

module.exports = router;
