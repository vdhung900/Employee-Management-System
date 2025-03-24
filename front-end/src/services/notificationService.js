import api from "./api";

export const notificationService = {
    getAllNotifications: () => api.get("/notifications"),
    getNotification: (id) => api.get(`/notifications/${id}`),
    createNotification: (data) => api.post("/notifications", data),
    updateNotification: (id, data) => api.put(`/notifications/${id}`, data),
    deleteNotification: (id) => api.delete(`/notifications/${id}`)
};
