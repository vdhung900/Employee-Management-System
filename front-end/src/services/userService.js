import api from "./api";

const userService = {

  // Lấy thông tin profile của user đang đăng nhập
  getUserProfile: async () => {
    try {
      const response = await api.get(`/auth/profile`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

};

export default userService; 