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

const authMiddleware = require("./middlewares/authMiddleware");

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

app.use((req, res, next) => {
  console.log(`Request URL: ${req.url}`);

  //Auth và upload (tạm thời) không cần jwt
  if (req.url.startsWith("/api/auth") || req.url.startsWith("/uploads")) {
    next();
  } else {
    authMiddleware(req, res, next);
  }
  // next(); // Chuyển sang middleware hoặc route tiếp theo
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
