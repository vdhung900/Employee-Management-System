import api from "./api";

export const leaveRequestService = {
    getAllLeaveRequests: () => api.get("/leave-requests"),
    getLeaveRequestById: (id) => api.get(`/leave-requests/${id}`),
    getLeaveRequestByEmployeeId: (id) => api.get(`/leave-requests/employee/${id}`),
    createLeaveRequest: (data) => api.post("/leave-requests", data),
    updateLeaveRequest: (id, data) => api.put(`/leave-requests/${id}`, data),
    deleteLeaveRequest: (id) => api.delete(`/leave-requests/${id}`)
};
