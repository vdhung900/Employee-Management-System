import {fetchFileWithAuth, handleApiError} from "../utils/FetchWithAuth";
import APIConfig from "./APIConfig";

const FileService = {
    async uploadFile(body){
        try{
            return await fetchFileWithAuth("/upload", "POST", body);
        }catch (e) {
            throw handleApiError(e);
        }
    },
    async getFile(key){
        try{
            return await this.downloadFile(key);
        }catch (e) {
            throw handleApiError(e)
        }
    },
    async downloadFile(key){
        try{
            const token = localStorage.getItem("accessToken");
            if (!token) {
                throw new Error("Đã hết hạn đăng nhập !!!");
            }
            
            const url = `${APIConfig.baseUrl}/files/${key}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            
            if (!response.ok) {
                throw new Error('Không thể tải file');
            }
            
            return await response.blob();
        }catch (e) {
            throw handleApiError(e)
        }
    },
    async deleteFile(key){
        try{
            return await fetchFileWithAuth(`${key}`, "DELETE");
        }catch (e) {
            throw handleApiError(e)
        }
    }
}

export default FileService;
