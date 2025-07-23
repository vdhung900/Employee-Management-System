import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EditProfileDto, ResetPasswordDto } from './profile.dto';
import {Model, Types} from 'mongoose';
import { Employees, EmployeesDocument } from 'src/schemas/employees.schema';
import { Account, AccountDocument } from 'src/schemas/account.schema';
import { Departments, DepartmentsDocument } from 'src/schemas/departments.schema';
import { Position, PositionDocument } from 'src/schemas/position.schema';
import { SalaryCoefficient, SalaryCoefficientDocument } from 'src/schemas/salaryCoefficents.schema';
import { SalaryRank, SalaryRankDocument } from 'src/schemas/salaryRank.schema';

Injectable()
export class ProfileService {
    constructor(
        @InjectModel(Employees.name) private employeeModel: Model<EmployeesDocument>,
        @InjectModel(Departments.name) private departmentModel: Model<DepartmentsDocument>,
        @InjectModel(Position.name) private positionModel: Model<PositionDocument>,
        @InjectModel(SalaryCoefficient.name) private salaryCoefficientModel: Model<SalaryCoefficientDocument>,
        @InjectModel(SalaryRank.name) private salaryRankModel: Model<SalaryRankDocument>,
        @InjectModel(Account.name) private accountModel: Model<AccountDocument>,

    ) {}

    async editProfile(id: string, dto: EditProfileDto) {
        const employee = await this.employeeModel.findByIdAndUpdate(id, dto, { new: true });
        return employee;
    }

    async getProfile(id: string) {
        const employee = await this.employeeModel.findById(id).populate('departmentId')
        .populate('positionId')
        .populate({
            path: 'salaryCoefficientId',
            populate: {
                path: 'salary_rankId',
                select: 'salary_base'
            }
        })
        return employee;
    }

    async resetPassword (id: string, dto: ResetPasswordDto) {
        const employee = await this.accountModel.findByIdAndUpdate(id, dto, { new: true });
        return employee;
    }

    async getAccount(id: string) {
        const account = await this.accountModel.findOne({username: id});
        return account;
    }
}
