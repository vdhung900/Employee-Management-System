import { fetchWithAuth, handleApiError } from "../utils/FetchWithAuth";

const GoalService = {
  // Lấy danh sách mục tiêu theo department
  async getMonthlyGoalsByDepartment(departmentId) {
    try {
      const response = await fetchWithAuth(`/monthly-goal/department/${departmentId}`, "GET");
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Gửi đánh giá hiệu suất
  async submitPerformanceReview(reviewData) {
    try {
      const response = await fetchWithAuth("/performance-review", "POST", reviewData);
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export default GoalService;
