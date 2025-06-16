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
    }
}

export default CategoryService;