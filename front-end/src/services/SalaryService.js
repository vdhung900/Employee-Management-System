import {fetchWithAuth, handleApiError} from "../utils/FetchWithAuth";

let endpointService = '/salary-calc';

const SalaryService = {
    async caculateSalary() {
        try {
            const res = await fetchWithAuth(`${endpointService}/run`, 'POST');
            return res;
        } catch (e) {
            throw handleApiError(e);
        }
    },
    async getSalaryCaculatedByMonth(month){
        try {
            const res = await fetchWithAuth(`${endpointService}/get-by-month/${month}`, 'GET');
            return res;
        } catch (e) {
            throw handleApiError(e);
        }
    },
    async getSalaryPreviewByMonth(month){
        try {
            const res = await fetchWithAuth(`${endpointService}/generate-pdf/${month}`, 'GET');
            return res;
        } catch (e) {
            throw handleApiError(e);
        }
    },
    async signSalaryPdf(payload){
        try {
            const res = await fetchWithAuth(`${endpointService}/sign`, 'POST', payload);
            return res;
        } catch (e) {
            throw handleApiError(e);
        }
    },
    async signSalaryPdfByManage(payload){
        try {
            const res = await fetchWithAuth(`${endpointService}/sign-by-manage`, 'POST', payload);
            return res;
        } catch (e) {
            throw handleApiError(e);
        }
    }
};

export default SalaryService;