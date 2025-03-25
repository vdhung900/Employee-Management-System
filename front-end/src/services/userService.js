import api from "./api";

const userService = {

  // Lấy thông tin profile của user đang đăng nhập
  getUserProfile: async () => {
    try {
      // Kiểm tra token trước khi gọi API
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await api.get(`/auth/profile`);
      console.log("Kết quả API profile:", response.data);
      return response.data;
    } catch (error) {
      // Xử lý lỗi 401, 403
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        // Xóa token nếu không hợp lệ
        localStorage.removeItem('token');
      }
      throw error;
    }
  },

  // Kiểm tra token hợp lệ
  checkTokenValidity: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return false;
      }
      
      await api.get('/auth/verify-token');
      return true;
    } catch (error) {
      // Xóa token nếu không hợp lệ
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        localStorage.removeItem('token');
      }
      return false;
    }
  },

  // Lấy thông tin user theo ID
  getUserById: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Cập nhật thông tin user
  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Đổi mật khẩu
  changePassword: async (userId, passwordData) => {
    try {
      const response = await api.put(`/users/${userId}/change-password`, passwordData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy danh sách user (admin)
  getAllUsers: async () => {
    try {
      const response = await api.get(`/users`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy danh sách điểm danh của user
  getUserAttendance: async (userId, month, year) => {
    try {
      const response = await api.get(`/attendances/user/${userId}`, {
        params: { month, year }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy danh sách ngày nghỉ của user
  getUserLeaves: async (userId) => {
    try {
      const response = await api.get(`/leaves/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy thông tin lương của user
  getUserSalary: async (userId, month, year) => {
    try {
      const response = await api.get(`/salaries/user/${userId}`, {
        params: { month, year }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default userService; 