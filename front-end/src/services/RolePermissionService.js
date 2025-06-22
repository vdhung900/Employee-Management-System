import {fetchWithAuth, handleApiError} from "../utils/FetchWithAuth";

const RolePermissionService = {
    async createRole(body){
        try{
            return await fetchWithAuth('/role-permission/role', 'POST', body);
        }catch (e) {
            throw handleApiError(e);
        }
    },
    async updateRole(body){
        try{
            return await fetchWithAuth('/role-permission/role', 'PUT', body);
        }catch (e) {
            throw handleApiError(e);
        }
    },
    async deleteRole(id){
        try{
            return await fetchWithAuth(`/role-permission/role/${id}`, 'DELETE');
        }catch (e) {
            throw handleApiError(e);
        }
    },
    async getAllRoles(){
        try{
            return await fetchWithAuth('/role-permission/roles');
        }catch (e) {
            throw handleApiError(e);
        }
    },
    async createPermission(body){
        try{
            return await fetchWithAuth('/role-permission/permission', 'POST', body);
        }catch (e) {
            throw handleApiError(e);
        }
    },
    async updatePermission(body){
        try{
            return await fetchWithAuth('/role-permission/permission', 'PUT', body);
        }catch (e) {
            throw handleApiError(e);
        }
    },
    async deletePermission(id){
        try{
            return await fetchWithAuth(`/role-permission/permission/${id}`, 'DELETE');
        }catch (e) {
            throw handleApiError(e);
        }
    },
    async getAllPermissions(body){
        try{
            return await fetchWithAuth('/role-permission/permission/search', 'POST', body);
        }catch (e) {
            throw handleApiError(e);
        }
    },
    async getAll(){
        try{
            return await fetchWithAuth('/role-permission/permission');
        }catch (e) {
            throw handleApiError(e);
        }
    },
    async getAllRolePermission(body){
        try{
            return await fetchWithAuth('/role-permission/search', 'POST', body);
        }catch (e) {
            throw handleApiError(e);
        }
    },
    async updateRolePermission(id, body){
        try{
            return await fetchWithAuth(`/role-permission/role/${id}/permissions`, 'PUT', body);
        }catch (e) {
            throw handleApiError(e);
        }
    }
}

export default RolePermissionService;