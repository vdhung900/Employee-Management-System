import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model, Types} from "mongoose";
import {JwtService} from "@nestjs/jwt";
import {RolePermission, RolePermissionDocument} from "../../../schemas/role_permission.schema";
import {RoleDocument, Roles} from "../../../schemas/roles.schema";
import {Permission, PermissionDocument} from "../../../schemas/permission.schema";
import {
    CreateRoleDto,
    UpdateRoleDto,
    CreatePermissionDto,
    UpdatePermissionDto,
    UpdateRolePermissionsDto,
} from "./role_permission.dto";
import {paginate} from "../../../utils/pagination";

@Injectable()
export class RolePermissionService {
    constructor(
        @InjectModel(RolePermission.name) private rolePermissionModel: Model<RolePermissionDocument>,
        @InjectModel(Roles.name) private roleModel: Model<RoleDocument>,
        @InjectModel(Permission.name) private permissionModel: Model<PermissionDocument>,
        private jwtService: JwtService
    ) {
    }

    async createRole(dto: CreateRoleDto) {
        try {
            const check = await this.roleModel.findOne({name: dto.name, code: dto.code});
            if (check) {
                throw new Error("Role with this name or code already exists");
            }
            const role = await this.roleModel.create(dto);
            const rolePermission = new this.rolePermissionModel({
                role: role._id,
                permissions: [],
            });
            await rolePermission.save();
            return role;
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async getRoles() {
        return this.roleModel.find();
    }

    async getRoleByCode(code: string) {
        return this.roleModel.findOne({code: code}).exec();
    }

    async updateRole(id: string, dto: UpdateRoleDto) {
        return this.roleModel.findByIdAndUpdate(id, dto, {new: true});
    }

    async deleteRole(id: string) {
        await this._removeRolePermissions(id);
        return this.roleModel.findByIdAndDelete(id);
    }

    async createPermission(dto: CreatePermissionDto) {
        try{
            const check = await this.permissionModel.findOne({name: dto.name, code: dto.code, path: dto.path});
            if(check) {
                throw new Error("Permission with this name, code or path already exists");
            }
            return this.permissionModel.create(dto);
        }catch(err){
            throw new Error(err.message);
        }
    }

    async getPermissions(req: CreatePermissionDto) {
        try{
            const data = await this.permissionModel.find()
            return paginate(data, req.page, req.limit)
        }catch (e) {
            throw new Error(e.message);
        }
    }

    async getAllPermissions() {
        try{
            return await this.permissionModel.find()
        }catch (e) {
            throw new Error(e.message);
        }
    }

    async getPermissionById(id: string) {
        return this.permissionModel.findById(id);
    }

    async updatePermission(id: string, dto: UpdatePermissionDto) {
        return this.permissionModel.findByIdAndUpdate(id, dto, {new: true});
    }

    async deletePermission(id: string) {
        await this._removePermissionFromRoles(id);
        return this.permissionModel.findByIdAndDelete(id);
    }

    async updateRolePermissions(dto: UpdateRolePermissionsDto) {
        try{
            const {roleId, permissionIds} = dto;
            const rolePermission = await this.rolePermissionModel.findOne({role: new Types.ObjectId(roleId)}).exec();
            if (!rolePermission) {
                throw new Error("Role not found");
            }
            rolePermission.permissions = [];
            rolePermission.permissions = permissionIds.map(id => new Types.ObjectId(id));
            return await rolePermission.save();
        }catch (e) {
            throw e;
        }
    }

    async getRolePermission(req: UpdateRolePermissionsDto) {
        try{
            const data = await this.rolePermissionModel.find({}).populate("role").populate("permissions").exec();
            return paginate(data, req?.page, req?.limit)
        }catch (e) {
            throw new Error(e.message);
        }
    }

    async getRolePermissionByRole(roleId: Types.ObjectId) {
        try{
            const data = await this.rolePermissionModel.findOne({role: roleId}).populate("role", "name code").populate("permissions", "name path code").exec();
            return data;
        }catch (e) {
            throw new Error(e.message);
        }
    }

    private async _removeRolePermissions(roleId: string) {
        await this.rolePermissionModel.deleteMany({role: roleId});
    }

    private async _removePermissionFromRoles(permissionId: string) {
        await this.rolePermissionModel.updateMany(
            {},
            {$pull: {permissions: permissionId}}
        );
    }
}
