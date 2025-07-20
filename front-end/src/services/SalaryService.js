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
    }
};

export default SalaryService;