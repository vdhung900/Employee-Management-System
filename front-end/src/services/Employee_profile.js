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
    }   
}
export default Employee_profile;