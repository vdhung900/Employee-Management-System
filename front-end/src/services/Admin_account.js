import apiConfig from "./APIConfig.js";
import {fetchWithAuth, handleApiError} from "../utils/FetchWithAuth";

const Admin_account = {
  async getAllAcount() {
    try {
      return await fetchWithAuth("/admin-accounts", 'GET');
    } catch (e) {
      throw handleApiError(error);
    }
  },

  async getAccountById(id) {
    try {
      return await fetchWithAuth(`/admin-accounts/${id}`, 'GET');
    } catch (e) {
      throw handleApiError(error);
    }
  },

  async createAccount(Data) {
    try {
      return await fetchWithAuth("/admin-accounts", 'POST', Data);
    } catch (e) {
      throw handleApiError(error);
    }
  },

  async updateAccount(id, Data) {
    try {
      return await fetchWithAuth(`/admin-accounts/${id}`, 'PUT', Data);
    } catch (e) {
      throw handleApiError(error);
    }
  },
  async resetPassword(id, Data) {
    try {
      return await fetchWithAuth(`/admin-accounts/${id}/reset-password`, 'PUT', Data);
    } catch (e) {
      throw handleApiError(error);
    }
  },

  async deleteAccount(id) {
    try {
      return await fetchWithAuth(`/reset-password/${id}`, 'DELETE');
    } catch (e) {
      throw handleApiError(error);
    }
  },
};

export default Admin_account;
