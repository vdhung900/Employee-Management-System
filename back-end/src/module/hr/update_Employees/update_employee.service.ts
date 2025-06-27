import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Employees, EmployeesDocument } from '../../../schemas/employees.schema';
import { UpdateEmployeeDto } from './update_employee.dto';
import { Departments, DepartmentsDocument } from 'src/schemas/departments.schema';
import { Position, PositionDocument } from 'src/schemas/position.schema';
import { SalaryCoefficient, SalaryCoefficientDocument } from 'src/schemas/salaryCoefficents.schema';
import { Model } from 'mongoose';

@Injectable()
export class UpdateEmployeeService {
  constructor(
    @InjectModel(Employees.name) private employeeModel: Model<EmployeesDocument>,
    @InjectModel(Departments.name) private departmentModel: Model<DepartmentsDocument>,
    @InjectModel(Position.name) private positionModel: Model<PositionDocument>,
    @InjectModel(SalaryCoefficient.name) private salaryCoefficientModel: Model<SalaryCoefficientDocument>,
  ) {}

  async updateEmployee(id: string, updateData: UpdateEmployeeDto) {
    const employee = await this.employeeModel.findByIdAndUpdate(id, updateData, { new: true });
    return employee;
  }
  
  async getEmployees(query?: any) {
    const employees = await this.employeeModel.find()
    .populate({
      path: 'departmentId',
      select: 'name'
    })
    .populate({
      path: 'positionId',
      select: 'name'
    })
    .populate({
      path: 'salaryCoefficientId',
      select: 'salary_coefficient'
    })
    .exec();
    return employees;
  }

  async getEmployeeById(id: string) {
    const employee = await this.employeeModel.findById(id).populate('departmentId').populate('positionId').populate('salaryCoefficientId').exec();
    return employee;
  }

  async getAllCoefficient() {
    const coefficient = await this.salaryCoefficientModel.find().exec();
    return coefficient;
  }

 
}   