import { IsEmpty, IsMongoId, IsNotEmpty } from "class-validator";
import { ObjectId, Types } from "mongoose";

export class CreateAccount{
    @IsEmpty({message: 'Tên người dùng không được để trống'})
    username: string;
    @IsEmpty({message: 'Mật khẩu người dùng không được để trống'})
    password: string;

    role: string;

    status: string;

    employeeId: Types.ObjectId;
}

export class UpdateAccount{
    @IsMongoId({message: 'ID không hợp lệ'})
    @IsNotEmpty({message: 'ID không được để trống'})
    _id: Types.ObjectId;
    @IsEmpty({message: 'Tên người dùng không được để trống'})
    username: string;
  
    role: string;

    status: string;
    
}

export class ResetPassword{
    @IsMongoId({message: 'ID không hợp lệ'})
    @IsNotEmpty({message: 'ID không được để trống'})
    _id: Types.ObjectId;
    @IsEmpty({message: 'Mật khẩu người dùng không được để trống'})
    password: string;

    
}