import {fetchWithAuth, handleApiError} from "../utils/FetchWithAuth";

const Hr_Employee = {
    async updateEmployee(id, data) {
        try {
            const response = await fetchWithAuth(`/hr/employees/${id}`, 'PUT', data);
            return response;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    async getEmployeeById(id) {
        try {
            const response = await fetchWithAuth(`/hr/employees/${id}`, 'GET');
            return response;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    async getAllEmployee() {
        try {
            const response = await fetchWithAuth(`/hr/employees`, 'GET');
            return response;
        } catch (error) {
            throw handleApiError(error);
        }
    },
    async getAllCoefficient() {
        try {
            const response = await fetchWithAuth(`/hr/coefficient`, 'GET');
            return response;
        } catch (error) {
            throw handleApiError(error);
        }
    }


};
export default Hr_Employee;