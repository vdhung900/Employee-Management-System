import api from "./api";

export const getSalaries = () => api.get("/salaries");
export const getSalaryById = (id) => api.get(`/salaries/detail/${id}`);
export const getSalaryByEmployeeId = (employeeId) => api.get(`/salaries/${employeeId}`);
export const createSalary = (salaryData) => api.post("/salaries", salaryData);
export const updateSalary = (id, salaryData) => api.put(`/salaries/${id}`, salaryData);
export const deleteSalary = (id) => api.delete(`/salaries/${id}`);

export const salaryService = {
  getSalaries,
  getSalaryById,
  getSalaryByEmployeeId,
  createSalary,
  updateSalary,
  deleteSalary,
}; 