import api from "./api";

export const departmentService = {
  getAllDepartments: () => api.get("/departments"),
  getDepartment: (id) => api.get(`/departments/${id}`),
  createDepartment: (data) => api.post("/departments", data),
  updateDepartment: (id, data) => api.put(`/departments/${id}`, data),
  deleteDepartment: (id) => api.delete(`/departments/${id}`),
  addEmployeeToDepartment: (departmentId, data) => 
    api.post(`/departments/${departmentId}/add-employee`, data),
  removeEmployeeFromDepartment: (employeeId) => 
    api.post(`/departments/remove-employee`, { employeeId })
};
