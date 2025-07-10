import { fetchWithAuth, handleApiError } from "../utils/FetchWithAuth";

const PerformanceReviewService = {
  // Lấy danh sách đánh giá hiệu suất theo employee_id
  async getReviewsByEmployeeId(employeeId) {
    try {
      const response = await fetchWithAuth(
        `/performance-review/search?employee_id=${employeeId}`,
        "GET"
      );
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

export default PerformanceReviewService;
