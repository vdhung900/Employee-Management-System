import api from "./api";

export const getEmployees = () => api.get("/employees");
export const getEmployee = (id) => api.get(`/employees/${id}`);
export const createEmployee = (formData) => {
  return api.post("/employees", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const updateEmployee = (id, formData) => {
  return api.put(`/employees/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const deleteEmployee = (id) => api.delete(`/employees/${id}`);

export const employeeService = {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
