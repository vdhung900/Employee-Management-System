import {fetchWithAuth, handleApiError} from "../utils/FetchWithAuth";

const RequestService = {
    async getAllRequests(body) {
        try{
            return await fetchWithAuth('/system/all-logs', 'POST', body)
        }catch(error){
            throw handleApiError(error);
        }
    },
    async createRequest(body){
        try{
            return await fetchWithAuth('/request-manage/create', 'POST', body);
        }catch (e) {
            throw handleApiError(e);
        }
    },
    async updateRequest(body){
        try{
            return await fetchWithAuth('/request-manage/update', 'POST', body);
        }catch (e) {
            throw handleApiError(e);
        }
    },
    async approveRequest(body){
        try{
            return await fetchWithAuth('/request-manage/approve', 'POST', body);
        }catch (e) {
            throw handleApiError(e);
        }
    },
    async getByTypeCode(code){
        try{
            return await fetchWithAuth(`/request-manage/get-by-code/${code}`);
        }catch (e) {
            throw handleApiError(e);
        }
    },
    async getByFilterCode(body){
        try{
            return await fetchWithAuth(`/request-manage/get-by-filter-code`, 'POST', body);
        }catch (e) {
            throw handleApiError(e);
        }
    },
    async getByAccountId(body){
        try{
            return await fetchWithAuth('/request-manage/get-by-account-id', 'POST', body);
        }catch (e) {
            throw handleApiError(e);
        }
    },
    async checkByMonth(month){
        try{
            return await fetchWithAuth(`/request-manage/filter-by-month/${month}`, 'GET');
        }catch (e) {
            throw handleApiError(e);
        }
    }
}

export default RequestService;