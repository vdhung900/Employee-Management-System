const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protectedRoute');
const employeeRoutes = require('./routes/employeeRoutes');

const authMiddleware = require('./middlewares/authMiddleware');

// Cấu hình middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(cookieParser());

app.use((req, res, next) => {
  console.log(`Request URL: ${req.url}`);

  if (req.url.startsWith('/api/auth')) {
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
app.use('/api/auth', authRoutes);
app.use('/protected', protectedRoutes);
app.use('/api/employees', employeeRoutes);

module.exports = app; // Xuất app để sử dụng trong server.js
