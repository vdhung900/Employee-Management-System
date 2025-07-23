import {fetchWithAuth, handleApiError} from "../utils/FetchWithAuth";

let endpointService = '/leave-balance';

const LeaveBalanceService = {
    async getLeaveBalanceByEmpId(empId) {
        try {
            const response = await fetchWithAuth(`${endpointService}/get/${empId}`, 'GET');
            return response;
        } catch (error) {
            throw handleApiError(error);
        }
    },
};
export default LeaveBalanceService;