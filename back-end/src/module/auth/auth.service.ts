import { Body, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginReq } from 'src/interfaces/loginReq.interface';
import { Employees, EmployeesDocument } from 'src/schemas/employees.schema';
import { User, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Employees.name) private employeesModel: Model<EmployeesDocument>,
    ){

    }

    async login(req: LoginReq){
        try{
            const user = await this.userModel.findOne({username: req.username, password: req.password}).populate('employeeId').exec();
            if(!user){
                throw new Error('Invalid username or password');
            }
            return user;
        }catch(error){
            throw new Error(error.message);
        }
    }
}
