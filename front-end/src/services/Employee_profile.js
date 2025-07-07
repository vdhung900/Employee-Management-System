import {fetchWithAuth, handleApiError} from "../utils/FetchWithAuth";

const Employee_profile = {
    async getEmployeeProfile(id) {
        try {
            const response = await fetchWithAuth(`/employee/profile/${id}`, 'GET');
            return response;
        } catch (error) {
            throw handleApiError(error);
        }
    },
    async updateEmployeeProfile(id, data) {
        try {
            const response = await fetchWithAuth(`/employee/profile/${id}`, 'PUT', data);
            return response;
        } catch (error) {
            throw handleApiError(error);
        }
    }  ,

    async resetPassword(id, data) {
        try {
            const response = await fetchWithAuth(`/employee/profile/reset-password/${id}`, 'PUT', data);
            return response;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    async getAccount(id) {
        try {
            const response = await fetchWithAuth(`/employee/profile/account/${id}`, 'GET');
            return response;
        } catch (error) {
            throw handleApiError(error);
        }
    }
    
   
}
export default Employee_profile;

