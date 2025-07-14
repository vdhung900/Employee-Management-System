import {fetchWithAuth, handleApiError} from "../utils/FetchWithAuth";

const EmployeeProfile = {
    async getEmployeeProfile(id) {
        try {
            console.log(id)
            const response = await fetchWithAuth(`/employee/profile/${id}`);
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
export default EmployeeProfile;

