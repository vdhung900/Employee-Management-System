import {fetchWithAuth, handleApiError} from "../utils/FetchWithAuth";

const RequestService = {
    async getAllRequests(body) {
        try{
            return await fetchWithAuth('/request-manage/all-logs', 'POST', body)
        }catch(error){
            throw handleApiError(error);
        }
    },
    async createRequest(body){
        try{
            return await fetchWithAuth('/hr-request/create', 'POST', body);
        }catch (e) {
            throw handleApiError(e);
        }
    },
    async updateRequest(body){
        try{
            return await fetchWithAuth('/hr-request/update', 'POST', body);
        }catch (e) {
            throw handleApiError(e);
        }
    },
    async approveRequest(body){
        try{
            return await fetchWithAuth('/hr-request/approve', 'POST', body);
        }catch (e) {
            throw handleApiError(e);
        }
    },
    async getByTypeCode(code){
        try{
            return await fetchWithAuth(`/hr-request/get-by-code/${code}`);
        }catch (e) {
            throw handleApiError(e);
        }
    },
    async getByAccountId(body){
        try{
            return await fetchWithAuth('/hr-request/get-by-account-id', 'POST', body);
        }catch (e) {
            throw handleApiError(e);
        }
    }
}

export default RequestService;