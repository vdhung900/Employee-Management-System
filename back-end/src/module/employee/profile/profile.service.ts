import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EditProfileDto } from './profile.dto';
import { Employees, EmployeesDocument } from 'src/schemas/employees.schema';
import { Departments, DepartmentsDocument } from 'src/schemas/departments.schema';
import { Position, PositionDocument } from 'src/schemas/position.schema';
import { SalaryCoefficient, SalaryCoefficientDocument } from 'src/schemas/salaryCoefficents.schema';

Injectable()
export class ProfileService {
    constructor(
        @InjectModel(Employees.name) private employeeModel: Model<EmployeesDocument>,
        @InjectModel(Departments.name) private departmentModel: Model<DepartmentsDocument>,
        @InjectModel(Position.name) private positionModel: Model<PositionDocument>,
        @InjectModel(SalaryCoefficient.name) private salaryCoefficientModel: Model<SalaryCoefficientDocument>,

    ) {}

    async editProfile(id: string, dto: EditProfileDto) {
        const employee = await this.employeeModel.findByIdAndUpdate(id, dto, { new: true });
        return employee;
    }

    async getProfile(id: string) {
        const employee = await this.employeeModel.findById(id).populate('departmentId').populate('positionId').populate('salaryCoefficientId');
        return employee;
    }
}
