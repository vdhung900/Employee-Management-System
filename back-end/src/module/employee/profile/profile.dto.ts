import { IsNotEmpty, IsString, IsMongoId, IsOptional } from 'class-validator';
import { BaseReq } from '../../../interfaces/request/baseReq.interface';
import { Types } from 'mongoose';


export class EditProfileDto extends BaseReq {
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

}