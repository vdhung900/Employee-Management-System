import api from "./api";

// Get all backup files
export const getBackupFiles = async () => {
  try {
    const response = await api.get("/backups");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create a new backup
export const createBackup = async () => {
  try {
    const response = await api.post("/backups");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Restore data from a backup file
export const restoreBackup = async (filename) => {
  try {
    const response = await api.post(`/backups/restore/${filename}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete a backup file
export const deleteBackup = async (filename) => {
  try {
    const response = await api.delete(`/backups/${filename}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
