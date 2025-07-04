import {fetchWithAuth, handleApiError} from "../utils/FetchWithAuth";

const SalaryCoefficientService = {
  async getAll() {
    try {
      const res = await fetchWithAuth("/hr/salary-coefficient", 'GET');
      return Array.isArray(res) ? res : res.data || [];
    } catch (e) {
      throw handleApiError(e);
    }
  },
  async getById(id) {
    try {
      const res = await fetchWithAuth(`/hr/salary-coefficient/${id}`, 'GET');
      return res.data || res;
    } catch (e) {
      throw handleApiError(e);
    }
  },
  async create(data) {
    try {
      return await fetchWithAuth("/hr/salary-coefficient", 'POST', data);
    } catch (e) {
      throw handleApiError(e);
    }
  },
  async update(id, data) {
    try {
      return await fetchWithAuth(`/hr/salary-coefficient/${id}`, 'PUT', data);
    } catch (e) {
      throw handleApiError(e);
    }
  },
  async getSalaryRanks() {
    try {
      const res = await fetchWithAuth('/hr/salary-coefficient/salary-rank', 'GET');
      return Array.isArray(res) ? res : res.data || [];
    } catch (e) {
      throw handleApiError(e);
    }
  },
};

export default SalaryCoefficientService; 