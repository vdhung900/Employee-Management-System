import api from "./api";

export const getAllAttendances = () => api.get("/attendances/employees/reports");
export const getMonthlyReport = (startDate, endDate) => 
  api.get("/attendances/employees/reports", {
    params: { startDate, endDate }
  });
export const createAttendance = (attendanceData) => 
  api.post("/attendances", attendanceData);
export const updateAttendance = (id, attendanceData) => 
  api.put(`/attendances/${id}`, attendanceData);
export const deleteAttendance = (id) => 
  api.delete(`/attendances/${id}`);
export const getEmployeeAttendance = (employeeId) =>
  api.get(`/attendances/${employeeId}`);

export const attendanceService = {
  getAllAttendances,
  getMonthlyReport,
  createAttendance,
  updateAttendance,
  deleteAttendance,
  getEmployeeAttendance,
}; 