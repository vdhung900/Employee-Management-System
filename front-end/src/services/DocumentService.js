import {fetchWithAuth, handleApiError} from "../utils/FetchWithAuth";

let endpointService = '/hr/document-manage';

const DocumentService = {
    async getAllEmployeesDocument() {
        try {
            const response = await fetchWithAuth(`${endpointService}/employees`, 'GET');
            return response;
        } catch (error) {
            throw handleApiError(error);
        }
    },
    async addDocumentForEmployee(body){
        try {
            const response = await fetchWithAuth(`${endpointService}/add`, 'POST', body);
            return response;
        } catch (error) {
            throw handleApiError(error);
        }
    },
    async deleteDocumentForEmployee(body){
        try {
            const response = await fetchWithAuth(`${endpointService}/delete`, 'POST', body);
            return response;
        } catch (error) {
            throw handleApiError(error);
        }
    }
};
export default DocumentService;