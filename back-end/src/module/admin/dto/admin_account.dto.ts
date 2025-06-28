import { IsEmpty, IsMongoId, IsNotEmpty, IsString, IsEmail, IsOptional, IsDate, IsEnum } from "class-validator";
import { Types } from "mongoose";

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

    @IsOptional()
    @IsString()
    salaryCoefficientId?: Types.ObjectId;
    @IsOptional()
    @IsString()
    code?: string;
}

export class UpdateAccount { 

    @IsOptional()
    @IsString()
    username?: string;
    
    @IsOptional()
    @IsMongoId({message: 'ID phòng ban không hợp lệ'})
    role?: Types.ObjectId;

   
    @IsOptional()
    @IsString()

    status?: string;

    // Employee fields
    @IsOptional()
    @IsString()
    fullName?: string;

    @IsOptional()
    @IsString()
    code?: string;

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