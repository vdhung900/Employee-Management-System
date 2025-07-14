import {fetchWithAuth, handleApiError} from "../utils/FetchWithAuth";

let endpointService = '/system';

const SystemService = {
    async getSystemSettingByCode(body) {
        try{
            return await fetchWithAuth(`${endpointService}/system-settings/get`, 'POST', body)
        }catch(error){
            throw handleApiError(error);
        }
    },
    async getLeaveSetting() {
        try{
            return await fetchWithAuth(`${endpointService}/leave-settings`)
        }catch(error){
            throw handleApiError(error);
        }
    },
}

export default SystemService;