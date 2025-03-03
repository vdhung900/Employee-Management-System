const express = require("express");
const app = express();

// Cấu hình middleware
app.use(express.json());

// Định nghĩa route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

module.exports = app; // Xuất app để sử dụng trong server.js
