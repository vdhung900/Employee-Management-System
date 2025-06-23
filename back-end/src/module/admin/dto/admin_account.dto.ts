import { IsEmpty, IsMongoId, IsNotEmpty, IsString, IsEmail, IsOptional, IsDate, IsEnum } from "class-validator";
import e from "express";
import { ObjectId, Types } from "mongoose";

export class CreateAccount {
    // @IsString()
    // username: string;

    // @IsString()
    // password: string;

    @IsOptional()
    @IsMongoId({message: 'ID phòng ban không hợp lệ'})
    role?: Types.ObjectId;

    @IsNotEmpty({message: 'Trạng thái không được để trống'})
    @IsString()
    status: string;

    // Thông tin nhân viên
    @IsNotEmpty({message: 'Tên nhân viên không được để trống'})
    @IsString()
    fullName: string;

    @IsOptional()
    @IsDate()
    dob?: Date;

    @IsOptional()
    @IsString()
    gender?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsNotEmpty({message: 'Email không được để trống'})
    @IsEmail({}, {message: 'Email không hợp lệ'})
    email: string;

    @IsOptional()
    @IsMongoId({message: 'ID phòng ban không hợp lệ'})
    departmentId?: Types.ObjectId;

    @IsOptional()
    @IsMongoId({message: 'ID chức vụ không hợp lệ'})
    positionId?: Types.ObjectId;

    @IsOptional()
    @IsDate()
    joinDate?: Date;

    @IsOptional()
    @IsDate()
    resignDate?: Date;

    @IsOptional()
    @IsString()
    bankAccount?: string;

    @IsOptional()
    @IsString()
    bankName?: string;

    @IsOptional()
    @IsString()
    document?: string;

    @IsOptional()
    @IsMongoId({message: 'ID hợp đồng không hợp lệ'})
    contractId?: Types.ObjectId;
}

export class UpdateAccount {
    @IsMongoId({message: 'ID không hợp lệ'})
    @IsNotEmpty({message: 'ID không được để trống'})
    _id: Types.ObjectId;

    @IsOptional()
    @IsString()
    username?: string;

    
    
    @IsOptional()
    @IsEnum(['admin', 'manager', 'employee'])
    @IsMongoId({message: 'ID phòng ban không hợp lệ'})
    role?: Types.ObjectId;

   
    @IsOptional()
    @IsEnum(['active', 'inactive'])
    @IsString()
    status?: string;

    // Employee fields
    @IsOptional()
    @IsString()
    fullName?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsDate()
    dob?: Date;

    @IsOptional()
    @IsString()
    @IsEnum(['male', 'female', 'other'])
    gender?: string;

    @IsOptional()
    @IsString()
    departmentId?: string;

    @IsOptional()
    @IsString()
    positionId?: string;

    @IsOptional()
    @IsDate()
    joinDate?: Date;

    @IsOptional()
    @IsString()
    bankAccount?: string;

    @IsOptional()
    @IsString()
    bankName?: string;

    @IsOptional()
    @IsString()
    document?: string;
}

export class ResetPassword {
    @IsNotEmpty({message: 'Mật khẩu không được để trống'})
    @IsString()
    password: string;
}
export class UpdateStatus {
    @IsNotEmpty({message: 'Trạng thái không được để trống'})
    @IsString()
    status: string;
}