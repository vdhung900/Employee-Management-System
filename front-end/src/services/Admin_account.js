import {fetchWithAuth, handleApiError} from "../utils/FetchWithAuth";

const Admin_account = {
  async getAllAcount() {
    try {
      return await fetchWithAuth("/admin-accounts", 'GET');
    } catch (e) {
      throw handleApiError(e);
    }
  },

  async getAccountById(id) {
    try {
      const response = await fetchWithAuth(`/admin-accounts/${id}`, 'GET');
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async createAccount(Data) {
    try {
      return await fetchWithAuth('/admin-accounts', 'POST', Data);
    } catch (e) {
      throw handleApiError(e);
    }
  },

  async updateAccount(id, Data) {
    try {
      return await fetchWithAuth(`/admin-accounts/${id}`, 'PUT', Data);
    } catch (e) {
      throw handleApiError(e);
    }
  },
  async resetPassword(id, Data) {
    try {
      return await fetchWithAuth(`/admin-accounts/${id}/reset-password`, 'PUT', Data);
    } catch (e) {
      throw handleApiError(e);
    }
  },

  async deleteAccount(id) {
    try {
      return await fetchWithAuth(`/admin-accounts/${id}`, 'DELETE');
    } catch (e) {
      throw handleApiError(e);
    }
  },

  async getAllDepartments() {
    try {
      return await fetchWithAuth(`/admin-accounts/departments`, 'GET');
    } catch (e) {
      throw handleApiError(e);
    }
  },

  async getAllPositions() {
    try {
      return await fetchWithAuth(`/admin-accounts/positions`, 'GET');
    } catch (e) {
      throw handleApiError(e);
    }
  },
  async getAllRoles() {
    try {
      return await fetchWithAuth('/role-permission/role', 'GET');
    } catch (e) {
      throw handleApiError(e);
    }
  },
};

export default Admin_account;
