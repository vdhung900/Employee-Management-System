import {
    Body,
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    HttpException,
    HttpStatus,
    UsePipes,
    ValidationPipe
} from "@nestjs/common";
import {RolePermissionService} from "./role_permission.service";
import {
    CreateRoleDto,
    UpdateRoleDto,
    CreatePermissionDto,
    UpdatePermissionDto,
    UpdateRolePermissionsDto
} from "./role_permission.dto";
import {BaseResponse} from "../../../interfaces/response/base.response";

@Controller("role-permission")
export class RolePermissionController {
    constructor(private readonly rolePermissionService: RolePermissionService) {
    }

    @Post("/role")
    @UsePipes(new ValidationPipe({whitelist: true}))
    async createRole(@Body() dto: CreateRoleDto): Promise<BaseResponse> {
        try {
            const data = await this.rolePermissionService.createRole(dto);
            return BaseResponse.success(data, "Thành công", HttpStatus.OK);
        } catch (e) {
            throw new HttpException({message: e.message}, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @Get("/role")
    async getRoles() {
        try {
            const data = await this.rolePermissionService.getRoles();
            return BaseResponse.success(data, "Thành công", HttpStatus.OK)
        } catch (e) {
            throw new HttpException({message: e.message}, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Put("/role/:id")
    @UsePipes(new ValidationPipe({whitelist: true}))
    async updateRole(@Param("id") id: string, @Body() dto: UpdateRoleDto) {
        try {
            const data = await this.rolePermissionService.updateRole(id, dto);
            return BaseResponse.success(data, "Thành công", HttpStatus.OK)
        } catch (e) {
            throw new HttpException({message: e.message}, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete("/role/:id")
    async deleteRole(@Param("id") id: string) {
        try {
            const data = await this.rolePermissionService.deleteRole(id);
            return BaseResponse.success(data, "Thành công", HttpStatus.OK)
        } catch (e) {
            throw new HttpException({message: e.message}, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post("/permission")
    @UsePipes(new ValidationPipe({whitelist: true}))
    async createPermission(@Body() dto: CreatePermissionDto) {
        try {
            const data = await this.rolePermissionService.createPermission(dto);
            return BaseResponse.success(data, "Thành công", HttpStatus.OK)
        } catch (e) {
            throw new HttpException({message: e.message}, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post("/permission/search")
    async getPermissions(@Body() req: CreatePermissionDto) {
        try {
            const data = await this.rolePermissionService.getPermissions(req);
            return BaseResponse.success(data, "Thành công", HttpStatus.OK)
        } catch (e) {
            throw new HttpException({message: e.message}, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get("/permission")
    async getAllPermissions() {
        try {
            const data = await this.rolePermissionService.getAllPermissions();
            return BaseResponse.success(data, "Thành công", HttpStatus.OK)
        } catch (e) {
            throw new HttpException({message: e.message}, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get("/permission/:id")
    async getPermissionById(@Param("id") id: string) {
        try {
            const data = await this.rolePermissionService.getPermissionById(id);
            return BaseResponse.success(data, "Thành công", HttpStatus.OK)
        } catch (e) {
            throw new HttpException({message: e.message}, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Put("/permission/:id")
    @UsePipes(new ValidationPipe({whitelist: true}))
    async updatePermission(@Param("id") id: string, @Body() dto: UpdatePermissionDto) {
        try {
            const data = await this.rolePermissionService.updatePermission(id, dto);
            return BaseResponse.success(data, "Thành công", HttpStatus.OK)
        } catch (e) {
            throw new HttpException({message: e.message}, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete("/permission/:id")
    async deletePermission(@Param("id") id: string) {
        try {
            const data = await this.rolePermissionService.deletePermission(id);
            return BaseResponse.success(data, "Thành công", HttpStatus.OK)
        } catch (e) {
            throw new HttpException({message: e.message}, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Put("/role/:id/permissions")
    @UsePipes(new ValidationPipe({whitelist: true}))
    async updateRolePermissions(@Param("id") roleId: string, @Body() body: { permissionIds: string[] }) {
        try {
            const dto: UpdateRolePermissionsDto = {roleId, permissionIds: body.permissionIds};
            const data = await this.rolePermissionService.updateRolePermissions(dto);
            return BaseResponse.success(data, "Thành công", HttpStatus.OK)
        } catch (e) {
            throw new HttpException({message: e.message}, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post("/search")
    async getAllRolesAndPermissions(@Body() req: UpdateRolePermissionsDto) {
        try {
            const data = await this.rolePermissionService.getRolePermission(req);
            return BaseResponse.success(data, "Thành công", HttpStatus.OK)
        } catch (e) {
            throw new HttpException({message: e.message}, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
