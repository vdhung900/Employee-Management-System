import {fetchWithAuth, handleApiError} from "../utils/FetchWithAuth";

const CategoryService = {
    async getTypeReqByRole(){
        try{
            const role = localStorage.getItem("role")
            if(!role) throw new Error("Bạn chưa đăng nhập !!!");
            return await fetchWithAuth(`/category/type-request/${role}`);
        }catch (e) {
            throw handleApiError(e);
        }
    },
    async getManage(){
        try{
            return await fetchWithAuth(`/departments/managers`);
        }catch (e) {
            throw handleApiError(e);
        }
    },
    async getDepartments(){
        try{
            return await fetchWithAuth(`/departments`);
        }catch (e) {
            throw handleApiError(e);
        }
    },
    async deleteDepartment(id){
        try{
            return await fetchWithAuth(`/departments/${id}`, 'DELETE');
        }catch (e) {
            throw handleApiError(e);
        }
    },
    async addDepartment(body){
        try{
            return await fetchWithAuth(`/departments`, 'POST', body);
        }catch (e) {
            throw handleApiError(e);
        }
    },
    async saveDepartment(body, id){
        try{
            return await fetchWithAuth(`/departments/${id}`, 'PATCH', body);
        }catch (e) {
            throw handleApiError(e);
        }
    }
}

export default CategoryService;