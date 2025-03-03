const app = require("./app"); // Nhập app từ app.js
const connectDB = require("./config/db"); // Nhập hàm connectDB từ db.js
const PORT = process.env.PORT || 404; // Cổng mặc định

// Kết nối đến cơ sở dữ liệu
connectDB();

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
