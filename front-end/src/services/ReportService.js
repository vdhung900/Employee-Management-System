import { fetchWithAuth, handleApiError } from '../utils/FetchWithAuth';

const ReportService = {
    async getStaffReport() {
        try {
            return await fetchWithAuth('/hr/reports/staff');
        } catch (error) {
            throw handleApiError(error);
        }
    },
    async getPayrollReport() {
        try {
            return await fetchWithAuth('/hr/reports/payroll');
        } catch (error) {
            throw handleApiError(error);
        }
    },
    async getAttendanceReport() {
        try {
            return await fetchWithAuth('/hr/reports/attendance');
        } catch (error) {
            throw handleApiError(error);
        }
    },
    async getPerformanceReport() {
        try {
            return await fetchWithAuth('/hr/reports/performance');
        } catch (error) {
            throw handleApiError(error);
        }
    }
};

export default ReportService; 