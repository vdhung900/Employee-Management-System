import { IsNotEmpty, IsOptional, IsString, IsMongoId, IsArray, ArrayNotEmpty, ArrayUnique } from 'class-validator';
import {BaseReq} from "../../../interfaces/request/baseReq.interface";

export class CreateRoleDto extends BaseReq{
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    code?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    status?: string;
}

export class UpdateRoleDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    code?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    status?: string;
}

export class CreatePermissionDto extends BaseReq {
    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    path?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    code?: string;
}

export class UpdatePermissionDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    path?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    code?: string;
}

export class UpdateRolePermissionsDto extends BaseReq {
    @IsOptional()
    roleId: string;
    @IsOptional()
    permissionIds: string[];
} 
