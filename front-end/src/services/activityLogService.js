import api from "./api";

/**
 * Lấy danh sách lịch sử hoạt động của tất cả người dùng
 * @param {Object} params - Các tham số truy vấn (page, limit, entityType)
 * @returns {Promise} - Promise trả về dữ liệu từ API
 */
export const getAllActivities = (params = {}) => {
  return api.get("/activity-logs", { params });
};

/**
 * Lấy danh sách lịch sử hoạt động của một người dùng cụ thể
 * @param {String} userId - ID của người dùng
 * @param {Object} params - Các tham số truy vấn (page, limit)
 * @returns {Promise} - Promise trả về dữ liệu từ API
 */
export const getUserActivities = (userId, params = {}) => {
  return api.get(`/activity-logs/user/${userId}`, { params });
};
