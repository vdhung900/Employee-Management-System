const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const protectedRoutes = require("./routes/protectedRoute");
const employeeRoutes = require("./routes/employeeRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const salaryRoutes = require("./routes/salaryRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const leaveRequestRoutes = require("./routes/leaveRequestRoutes");
const activityLogRoutes = require("./routes/activityLogRoutes");
const backupRoutes = require("./routes/backupRoutes");
const userRoutes = require("./routes/userRoutes");

const authMiddleware = require("./middlewares/authMiddleware");
const isAdmin = require("./middlewares/adminMiddleware");

// Cấu hình middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());

// Đường dẫn đến thư mục uploads
app.use("/uploads", express.static("uploads"));

//Middleware kiểm tra Authentication
app.use((req, res, next) => {
  console.log(`Request URL: ${req.url}`);
  const whiteList = ["/api/auth/login", "/uploads"];
  if (whiteList.some((url) => req.url.startsWith(url))) {
    next();
  } else {
    authMiddleware(req, res, next);
  }
});

//Middleware kiểm tra Authorization (Admin)
app.use((req, res, next) => {
  console.log(`Request URL: ${req.url}`);
  const whiteList = [
    "/api/auth/login",
    "/api/auth/logout",
    "/uploads",
    "/api/employees",
    "/api/auth/profile",
    "/api/attendances",
    "/api/notifications",
  ];

  if (whiteList.some((url) => req.url.startsWith(url))) {
    next();
  } else {
    isAdmin(req, res, next);
  }
});

// Định nghĩa route
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/api/auth", authRoutes);
app.use("/protected", protectedRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/salaries", salaryRoutes);
app.use("/api/attendances", attendanceRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/leave-requests", leaveRequestRoutes);
app.use("/api/activity-logs", activityLogRoutes);
app.use("/api/backups", backupRoutes);
app.use("/uploads", express.static("uploads"));

module.exports = app; // Xuất app để sử dụng trong server.js
