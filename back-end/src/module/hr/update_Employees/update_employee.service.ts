import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Employees, EmployeesDocument} from '../../../schemas/employees.schema';
import {UpdateEmployeeDto} from './update_employee.dto';
import {Departments, DepartmentsDocument} from 'src/schemas/departments.schema';
import {Position, PositionDocument} from 'src/schemas/position.schema';
import {SalaryCoefficient, SalaryCoefficientDocument} from 'src/schemas/salaryCoefficents.schema';
import {Contract, ContractDocument} from 'src/schemas/contracts.schema';
import {Model, Types} from 'mongoose';
import {SalaryRank} from "../../../schemas/salaryRank.schema";


@Injectable()
export class UpdateEmployeeService {
    constructor(
        @InjectModel(Employees.name) private employeeModel: Model<EmployeesDocument>,
        @InjectModel(Departments.name) private departmentModel: Model<DepartmentsDocument>,
        @InjectModel(Position.name) private positionModel: Model<PositionDocument>,
        @InjectModel(SalaryCoefficient.name) private salaryCoefficientModel: Model<SalaryCoefficientDocument>,
        @InjectModel(SalaryRank.name) private salaryRankModel: Model<SalaryCoefficientDocument>,
        @InjectModel(Contract.name) private contractModel: Model<ContractDocument>,
    ) {
    }

    async updateEmployee(id: string, updateData: UpdateEmployeeDto) {

        const department = updateData.departmentId ? new Types.ObjectId(updateData.departmentId) : null;
        const position = updateData.positionId ? new Types.ObjectId(updateData.positionId) : null;
        const salaryCoefficient = updateData.salaryCoefficientId ? new Types.ObjectId(updateData.salaryCoefficientId) : null;
        const contract = updateData.contractId ? new Types.ObjectId(updateData.contractId) : null;

        const updateData1 = {
            ...updateData,
            departmentId: department,
            positionId: position,
            salaryCoefficientId: salaryCoefficient,
            contractId: contract,
        }
        const employee = await this.employeeModel.findByIdAndUpdate(id, updateData1, {new: true});
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
            .populate({
                path: 'contractId',
                select: 'contract_type'
            })

            .exec();
        return employees;
    }

    async getEmployeeById(id: string) {
        const employee = await this.employeeModel.findById(id).populate('departmentId').populate('positionId').populate('salaryCoefficientId').exec();
        return employee;
    }

    async getAllCoefficient() {
        const coefficient = await this.salaryCoefficientModel.find().populate("salary_rankId").exec();
        return coefficient;
    }

    async getEmployeeByCode(code: string) {
        const employee = await this.employeeModel.findOne({code: code}).populate('departmentId').populate('positionId').populate('salaryCoefficientId').exec();
        return employee;
    }

    async getEmployeeByDepartmentId(departmentId: string) {
        const employee = await this.employeeModel.find({departmentId: departmentId}).populate('departmentId').populate('positionId').populate('salaryCoefficientId').exec();
        return employee;
    }

    async getAllContractType() {
        const contractType = await this.contractModel.find().exec();
        return contractType;
    }

    async getEmployeeAndSalaray() {
        try {
            const employees = await this.employeeModel.find({}, "fullName email phone departmentId positionId salaryCoefficientId contractId")
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
                    select: 'salary_coefficient salary_rankId rank',
                    populate: {
                        path: 'salary_rankId'
                    }
                })
                .populate({
                    path: 'contractId',
                    select: 'contract_type'
                })
                .exec();
            if(!employees || employees.length === 0) {
                throw new Error('Không tìm thấy nhân viên');
            }
            return employees;
        } catch (e) {
            throw new Error(e);
        }
    }

    async analyzeEmployeeDataByUserId() {
        try{

        }catch (e) {
            throw new Error(e);
        }
    }

}   