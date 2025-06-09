import {fetchWithAuth, handleApiError} from "../utils/FetchWithAuth";

const RequestService = {
    async getAllRequests(body) {
        try{
            return await fetchWithAuth('/request-manage/all-logs', 'POST', body)
        }catch(error){
            throw handleApiError(error);
        }
    }
}

export default RequestService;