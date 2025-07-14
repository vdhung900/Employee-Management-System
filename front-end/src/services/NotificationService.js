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
}

export default NotificationService;