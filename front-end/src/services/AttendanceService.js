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

  // Search attendance với filters
  searchAttendance: async (params) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetchWithAuth(
        `/attendance/search?${queryString}`,
        "GET"
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Lấy điểm danh theo tuần
  getWeeklyAttendance: async (weekStart) => {
    try {
      const queryString = weekStart ? `?weekStart=${weekStart}` : "";
      const response = await fetchWithAuth(
        `/attendance/weekly${queryString}`,
        "GET"
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Lấy điểm danh theo tháng
  getMonthlyAttendance: async (year, month) => {
    try {
      const queryString = new URLSearchParams();
      if (year) queryString.append("year", year);
      if (month) queryString.append("month", month);
      const response = await fetchWithAuth(
        `/attendance/monthly?${queryString.toString()}`,
        "GET"
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Lấy điểm danh theo employee ID
  getAttendanceByEmployee: async (employeeId, startDate, endDate) => {
    try {
      const queryString = new URLSearchParams();
      if (startDate) queryString.append("startDate", startDate);
      if (endDate) queryString.append("endDate", endDate);
      const response = await fetchWithAuth(
        `/attendance/employee/${employeeId}?${queryString.toString()}`,
        "GET"
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default AttendanceService;
