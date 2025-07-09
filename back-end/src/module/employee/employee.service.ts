import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Employees, EmployeesDocument } from 'src/schemas/employees.schema';

@Injectable()
export class EmployeeService {
    constructor(
        @InjectModel(Employees.name) private employeeModel: Model<EmployeesDocument>,
    ) {}

    async getEmployeeByDepartment(departmentId: string) {
        return this.employeeModel.find({ departmentId: new Types.ObjectId(departmentId) });
    }
} 