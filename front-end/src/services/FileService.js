import {fetchFileWithAuth, handleApiError} from "../utils/FetchWithAuth";

const FileService = {
    async uploadFile(body){
        try{
            return await fetchFileWithAuth("/upload", "POST", body);
        }catch (e) {
            throw handleApiError(e);
        }
    },
    async getFile(){
        try{

        }catch (e) {
            throw handleApiError(e)
        }
    },
    async deleteFile(){
        try{

        }catch (e) {
            throw handleApiError(e)
        }
    }
}

export default FileService;