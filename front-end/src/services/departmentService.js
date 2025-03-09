import api from "./api";

export const departmentService = {
  getAllDepartments: () => api.get("/departments"),
  getDepartment: (id) => api.get(`/departments/${id}`),
  createDepartment: (data) => api.post("/departments", data),
  updateDepartment: (id, data) => api.put(`/departments/${id}`, data),
  deleteDepartment: (id) => api.delete(`/departments/${id}`),
};
