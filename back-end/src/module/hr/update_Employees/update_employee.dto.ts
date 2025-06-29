import { IsNotEmpty, IsOptional, IsString, IsMongoId, IsArray, ArrayNotEmpty, ArrayUnique } from 'class-validator';
import {BaseReq} from "../../../interfaces/request/baseReq.interface";
import { Types } from 'mongoose';



export class UpdateEmployeeDto extends BaseReq {
    @IsOptional()
    @IsString()
    fullName?: string;

    @IsOptional()
    @IsString()
    dob?: Date;

    @IsOptional()
    @IsString()
    gender?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    email?: string;

    @IsOptional()
    @IsMongoId()
    departmentId?: Types.ObjectId;

    @IsOptional()
    @IsMongoId()
    positionId?: Types.ObjectId;

    @IsOptional()
    @IsMongoId()
    contractId?: Types.ObjectId;
  
    @IsOptional()
    @IsString()
    joinDate?: Date;

    @IsOptional()
    @IsString()
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
    @IsMongoId()
    salaryCoefficientId?: Types.ObjectId;   

}


