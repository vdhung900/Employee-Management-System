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
import {AttendanceRecords, AttendanceRecordsDocument} from "../../../schemas/attendanceRecords.schema";
import {MonthlyReview, MonthlyReviewDocument} from "../../../schemas/performanceReview.schema";


@Injectable()
export class UpdateEmployeeService {
    constructor(
        @InjectModel(Employees.name) private employeeModel: Model<EmployeesDocument>,
        @InjectModel(Departments.name) private departmentModel: Model<DepartmentsDocument>,
        @InjectModel(Position.name) private positionModel: Model<PositionDocument>,
        @InjectModel(SalaryCoefficient.name) private salaryCoefficientModel: Model<SalaryCoefficientDocument>,
        @InjectModel(SalaryRank.name) private salaryRankModel: Model<SalaryCoefficientDocument>,
        @InjectModel(Contract.name) private contractModel: Model<ContractDocument>,
        @InjectModel(AttendanceRecords.name) private attendanceRecordModel: Model<AttendanceRecordsDocument>,
        @InjectModel(MonthlyReview.name) private monthlyReviewModel: Model<MonthlyReviewDocument>,
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

    async analyzeEmployeeDataByUserId(userId: string) {
        try {
            const employee = await this.employeeModel.findById(userId)
                .populate('departmentId')
                .populate('positionId')
                .exec();

            if (!employee) {
                throw new Error('Không tìm thấy nhân viên');
            }

            const today = new Date();
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(today.getMonth() - 6);

            const attendanceRecords = await this.attendanceRecordModel.find({
                employeeId: employee._id,
                date: { $gte: sixMonthsAgo, $lte: today }
            }).exec();
            const totalDays = attendanceRecords.length;
            const presentDays = attendanceRecords.filter(record => record.status === 'present').length;
            const absentDays = attendanceRecords.filter(record => record.status === 'leave').length;
            const lateDays = attendanceRecords.filter(record => record.status === 'late').length;

            const performanceReviews = await this.monthlyReviewModel.find({
                employee_id: employee._id,
                $expr: {
                    $or: [
                        {
                            $and: [
                                { $eq: ['$year', today.getFullYear()] },
                                { $gte: ['$month', sixMonthsAgo.getMonth() + 1] }
                            ]
                        },
                        {
                            $and: [
                                { $eq: ['$year', sixMonthsAgo.getFullYear()] },
                                { $lte: ['$month', today.getMonth() + 1] }
                            ]
                        }
                    ]
                }
            }).exec();

            const avgPerformanceScore = performanceReviews.length > 0
                ? performanceReviews.reduce((sum, review) => sum + review.overallScore, 0) / performanceReviews.length
                : 0;

            const last6MonthsScores = performanceReviews
                .sort((a, b) => {
                    const dateA = new Date(a.year, a.month - 1);
                    const dateB = new Date(b.year, b.month - 1);
                    return dateB.getTime() - dateA.getTime();
                })
                .map(review => ({
                    month: `${review.year}-${String(review.month).padStart(2, '0')}`,
                    score: review.overallScore
                }));

            const monthlyAttendance = {};
            for (let i = 0; i < 6; i++) {
                const date = new Date();
                date.setMonth(date.getMonth() - i);
                const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                monthlyAttendance[monthKey] = {
                    present: 0,
                    absent: 0,
                    late: 0,
                    total: 0
                };
            }

            attendanceRecords.forEach(record => {
                const date = new Date(record.date);
                const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

                if (monthlyAttendance[monthKey]) {
                    monthlyAttendance[monthKey][record.status]++;
                    monthlyAttendance[monthKey].total++;
                }
            });
            return {
                employeeInfo: {
                    employeeId: employee._id,
                    fullName: employee.fullName,
                    department: employee.departmentId ? (employee.departmentId as any).name : 'N/A',
                    position: employee.positionId ? (employee.positionId as any).name : 'N/A',
                },
                attendance: {
                    overall: {
                        totalDays,
                        presentDays,
                        absentDays,
                        lateDays,
                        attendanceRate: totalDays > 0 ? (presentDays / totalDays) * 100 : 0
                    },
                    monthlyBreakdown: monthlyAttendance
                },
                performance: {
                    averageScore: avgPerformanceScore,
                    last6MonthsScores,
                    totalReviews: performanceReviews.length
                }
            };

        } catch (e) {
            throw new Error(`Error analyzing employee data: ${e.message}`);
        }
    }

}   
