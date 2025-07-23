import { fetchWithAuth, handleApiError } from "../utils/FetchWithAuth";

const StatisticsService = {
  async getEmployeesByDepartment(departmentId) {
    try {
      return await fetchWithAuth(`/employee/by-department/${departmentId}`);
    } catch (e) {
      throw handleApiError(e);
    }
  },
  async getLeaveRequestsByDepartment(departmentId) {
    try {
      return await fetchWithAuth(`/request-manage/leave/by-department/${departmentId}`);
    } catch (e) {
      throw handleApiError(e);
    }
  },

  // Method chính để lấy tất cả salary slip
  async getAllSalarySlips() {
    try {
      const response = await fetchWithAuth('/salary-calc/slips', 'GET');
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Lấy salary slip theo departmentId
  async getSalarySlipsByDepartment(departmentId) {
    try {
      const response = await fetchWithAuth(`/salary-calc/slips/department/${departmentId}`, 'GET');
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

export default StatisticsService; 