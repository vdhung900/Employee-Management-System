import { fetchWithAuth } from "../utils/FetchWithAuth";

const AttendanceService = {
  // Lấy thông tin điểm danh hôm nay của nhân viên
  getTodayAttendance: async () => {
    try {
      const response = await fetchWithAuth("/attendance/today", "GET");
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Check-in
  checkIn: async () => {
    try {
      const response = await fetchWithAuth("/attendance/check-in", "POST");
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Check-out
  checkOut: async () => {
    try {
      const response = await fetchWithAuth("/attendance/check-out", "POST");
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Lấy lịch sử điểm danh
  getAttendanceHistory: async (limit = 10) => {
    try {
      const response = await fetchWithAuth(
        `/attendance/history?limit=${limit}`,
        "GET"
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Lấy tất cả dữ liệu điểm danh (cho admin/manager)
  getAllAttendance: async () => {
    try {
      const response = await fetchWithAuth("/attendance", "GET");
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default AttendanceService;
