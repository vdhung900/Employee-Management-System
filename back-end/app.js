const express = require("express");
const app = express();
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protectedRoute');

// Cấu hình middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
// Định nghĩa route
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use('/auth', authRoutes);
app.use('/protected', protectedRoutes);

module.exports = app; // Xuất app để sử dụng trong server.js
