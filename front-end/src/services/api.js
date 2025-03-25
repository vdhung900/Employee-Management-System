import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:9999/api",
});

// Add JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log(`API Request to ${config.url}: Bearer token attached`);
  } else {
    console.log(`API Request to ${config.url}: No token available`);
  }
  return config;
}, (error) => {
  console.error("Lỗi khi gửi request:", error);
  return Promise.reject(error);
});

// Handle responses and token expiration
api.interceptors.response.use(
  (response) => {
    console.log(`API Response from ${response.config.url}: Status ${response.status}`);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(`API Error from ${error.config.url}: Status ${error.response.status}`, error.response.data);
      
      if (
        (error.response.status === 401 || error.response.status === 403)
      ) {
        // Token expired or invalid
        console.log("Token hết hạn hoặc không hợp lệ, đang đăng xuất và chuyển hướng...");
        localStorage.clear();
        // Check if we're not already on the login page to avoid redirection loops
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    } else if (error.request) {
      console.error("Không nhận được phản hồi từ server:", error.request);
    } else {
      console.error("Lỗi cấu hình request:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
