import { fetchWithAuth, handleApiError } from '../utils/FetchWithAuth';

const SalarySlipService = {
  async getMySalarySlips() {
    try {
      const response = await fetchWithAuth('/salary-calc/slip', 'GET');
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getSalarySlipById(id) {
    try {
      const response = await fetchWithAuth(`/salary-calc/slip/${id}`, 'GET');
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

export default SalarySlipService; 