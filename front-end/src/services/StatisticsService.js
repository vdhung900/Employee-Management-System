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
  }
};

export default StatisticsService; 