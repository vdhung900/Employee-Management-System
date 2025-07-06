import {fetchWithAuth, handleApiError} from "../utils/FetchWithAuth";

const Hr_ManageEmployee = {
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
    async getAllCoefficients() {
        try {
            const response = await fetchWithAuth(`/hr/coefficient`, 'GET');
            return response;
        } catch (error) {
            throw handleApiError(error);
        }
    }, 
    async getAllContracts() {
        try {
            const response = await fetchWithAuth(`/hr/contracts`, 'GET');
            return response;
        } catch (error) {
            throw handleApiError(error);
        }
    },
    async getEmployeeSalary(){
        try{
            return await fetchWithAuth('/hr/salary/employees')
        }catch (e) {
            throw handleApiError(e)
        }
    },
    async getAnalyzeEmployeeByUserId(userId) {
        try {
            const response = await fetchWithAuth(`/hr/analyze/employees/${userId}`, 'GET');
            return response;
        } catch (error) {
            throw handleApiError(error);
        }
    }
};
export default Hr_ManageEmployee;