import {fetchWithAuth, handleApiError} from "../utils/FetchWithAuth";

let endpointService = '/notification';

const NotificationService = {
    async getNotificationByCode(employeeId) {
        try{
            return await fetchWithAuth(`${endpointService}/${employeeId}`)
        }catch(error){
            throw handleApiError(error);
        }
    },
    async markReadOne(body) {
        try{
            return await fetchWithAuth(`${endpointService}/mark-read-one`, 'POST', body);
        }catch(error){
            throw handleApiError(error);
        }

    },
    async markReadAll(body) {
        try{
            return await fetchWithAuth(`${endpointService}/mark-read-all`, 'POST', body);
        }catch(error){
            throw handleApiError(error);
        }

    },
    async deleteAll(body) {
        try{
            return await fetchWithAuth(`${endpointService}/delete-all`, 'POST', body);
        }catch(error){
            throw handleApiError(error);
        }

    }
}

export default NotificationService;