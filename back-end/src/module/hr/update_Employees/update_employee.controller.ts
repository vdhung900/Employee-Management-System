import { Controller, Get, Put, Param, Body, HttpStatus, HttpException } from '@nestjs/common';
import { UpdateEmployeeService } from './update_employee.service';
import { UpdateEmployeeDto } from './update_employee.dto';
import { BaseResponse } from '../../../interfaces/response/base.response';
import { InjectModel } from '@nestjs/mongoose';
import { SalarySlip, SalarySlipDocument } from '../../../schemas/salarySlip.schema';
import { AttendanceRecords, AttendanceRecordsDocument } from '../../../schemas/attendanceRecords.schema';
import { MonthlyReview, MonthlyReviewDocument } from '../../../schemas/performanceReview.schema';
import { Model } from 'mongoose';
import {STATUS} from "../../../enum/status.enum";

@Controller('hr')
export class UpdateEmployeeController {
  constructor(
    private readonly updateEmployeeService: UpdateEmployeeService,
    @InjectModel(SalarySlip.name) private readonly salarySlipModel: Model<SalarySlipDocument>,
    @InjectModel(AttendanceRecords.name) private readonly attendanceRecordModel: Model<AttendanceRecordsDocument>,
    @InjectModel(MonthlyReview.name) private readonly monthlyReviewModel: Model<MonthlyReviewDocument>,
  ) {}

  @Get("/employees")
    async getEmployees() {
        try {
            const data = await this.updateEmployeeService.getEmployees();
            return BaseResponse.success(data, "Thành công", HttpStatus.OK)
        } catch (e) {
            throw new HttpException({message: e.message}, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get("/employees/:id")
    async getEmployeeById(@Param("id") id: string) {
        try {
            const data = await this.updateEmployeeService.getEmployeeById(id);
            return BaseResponse.success(data, "Thành công", HttpStatus.OK)
        } catch (e) {
            throw new HttpException({message: e.message}, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Put("/employees/:id")
    async updateEmployee(@Param("id") id: string, @Body() dto: UpdateEmployeeDto) {
        try {
            const data = await this.updateEmployeeService.updateEmployee(id, dto);
            return BaseResponse.success(data, "Thành công", HttpStatus.OK)
        } catch (e) {
            throw new HttpException({message: e.message}, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get("/coefficient")
    async getAllCoefficient() {
        try {
            const data = await this.updateEmployeeService.getAllCoefficient();
            return BaseResponse.success(data, "Thành công", HttpStatus.OK)
        } catch (e) {
            throw new HttpException({message: e.message}, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @Get("/contracts")
    async getAllContract() {
        try {
            const data = await this.updateEmployeeService.getAllContractType();
            return BaseResponse.success(data, "Thành công", HttpStatus.OK)
        } catch (e) {
            throw new HttpException({message: e.message}, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get("/salary/employees")
    async getEmployeesBySalary() {
        try {
            const data = await this.updateEmployeeService.getEmployeeAndSalaray();
            return BaseResponse.success(data, "Thành công", HttpStatus.OK)
        } catch (e) {
            throw new HttpException({message: e.message}, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get("/analyze/employees/:userId")
    async getAnalyzeEmployeeByUserId(@Param("userId") userId: string) {
        try {
            const data = await this.updateEmployeeService.analyzeEmployeeDataByUserId(userId);
            return BaseResponse.success(data, "Thành công", HttpStatus.OK)
        } catch (e) {
            throw new HttpException({message: e.message}, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // HR Reports endpoints
    @Get('/reports/staff')
    async getStaffReport() {
        try {
            const employees = await this.updateEmployeeService.getEmployees();
            // Tổng hợp theo phòng ban
            const departmentMap: Record<string, any> = {};
            employees.forEach(emp => {
                // Fix: type assertion for departmentId
                const dept = (emp.departmentId && typeof emp.departmentId === 'object' && 'name' in emp.departmentId)
                    ? (emp.departmentId as { name: string }).name
                    : 'Khác';
                if (!departmentMap[dept]) {
                    departmentMap[dept] = { department: dept, total: 0, new: 0, leave: 0, male: 0, female: 0 };
                }
                departmentMap[dept].total++;
                if (emp.gender === 'male') departmentMap[dept].male++;
                if (emp.gender === 'female') departmentMap[dept].female++;
                // Giả lập: nếu joinDate trong tháng này thì là nhân viên mới, nếu resignDate trong tháng này thì là nghỉ việc
                const now = new Date();
                if (emp.joinDate && new Date(emp.joinDate).getMonth() === now.getMonth() && new Date(emp.joinDate).getFullYear() === now.getFullYear()) {
                    departmentMap[dept].new++;
                }
                if (emp.resignDate && new Date(emp.resignDate).getMonth() === now.getMonth() && new Date(emp.resignDate).getFullYear() === now.getFullYear()) {
                    departmentMap[dept].leave++;
                }
            });
            return BaseResponse.success(Object.values(departmentMap), 'Báo cáo nhân sự', HttpStatus.OK);
        } catch (e) {
            throw new HttpException({ message: e.message }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('/reports/payroll')
    async getPayrollReport() {
        try {
            // Lấy tất cả salary slips 6 tháng gần nhất
            const now = new Date();
            const months: { year: number; month: number }[] = [];
            for (let i = 5; i >= 0; i--) {
                const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                months.push({ year: d.getFullYear(), month: d.getMonth() + 1 });
            }
            const salarySlips = await this.salarySlipModel.find({
                $or: months.map(m => ({ year: m.year, month: m.month }))
            }).exec() as any[];
            // Tổng hợp theo tháng
            const result = months.map(m => {
                const slips = salarySlips.filter(s => s.year === m.year && s.month === m.month);
                const totalSalary = slips.reduce((sum, s) => sum + (s.totalBaseSalary || 0), 0);
                const bonus = slips.reduce((sum, s) => sum + (s.benefit || 0), 0);
                const deductions = slips.reduce((sum, s) => sum + (s.personalIncomeTax || 0) + (s.insurance || 0) + (s.latePenalty || 0) + (s.unpaidLeave || 0), 0);
                const netPayment = slips.reduce((sum, s) => sum + (s.netSalary || 0), 0);
                return {
                    month: `T${m.month}/${m.year}`,
                    totalSalary,
                    bonus,
                    deductions,
                    netPayment
                };
            });
            return BaseResponse.success(result, 'Báo cáo lương', HttpStatus.OK);
        } catch (e) {
            throw new HttpException({ message: e.message }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('/reports/attendance')
    async getAttendanceReport() {
        try {
            // Lấy attendance 6 tháng gần nhất
            const now = new Date();
            const months: { year: number; month: number }[] = [];
            for (let i = 5; i >= 0; i--) {
                const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                months.push({ year: d.getFullYear(), month: d.getMonth() + 1 });
            }
            // Lấy tất cả bản ghi trong 6 tháng gần nhất
            const fromDate = new Date(months[0].year, months[0].month - 1, 1);
            const toDate = new Date(months[5].year, months[5].month, 0, 23, 59, 59);
            const records = await this.attendanceRecordModel.find({
                date: { $gte: fromDate, $lte: toDate }
            }).exec() as any[];
            // Tổng hợp theo tháng
            const result = months.map(m => {
                const recs = records.filter(r => {
                    const d = new Date(r.date);
                    return d.getFullYear() === m.year && d.getMonth() + 1 === m.month;
                });
                const total = recs.length;
                const onTime = recs.filter(r => r.status === STATUS.PRESENT).length;
                const late = recs.filter(r => r.status === STATUS.LATE).length;
                const absent = recs.filter(r => r.status === 'absent').length;
                const leave = recs.filter(r => r.status === STATUS.LEAVE).length;
                const overtime = recs.reduce((sum, r) => sum + (r.totalOtHour ? r.totalOtHour : 0), 0);
                return {
                    month: `T${m.month}/${m.year}`,
                    total,
                    onTime,
                    late,
                    absent,
                    leave,
                    overtime
                };
            });
            return BaseResponse.success(result, 'Báo cáo chấm công', HttpStatus.OK);
        } catch (e) {
            throw new HttpException({ message: e.message }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('/reports/performance')
    async getPerformanceReport() {
        try {
            const now = new Date();
            const months: { year: number; month: number }[] = [];
            for (let i = 5; i >= 0; i--) {
                const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                months.push({ year: d.getFullYear(), month: d.getMonth() + 1 });
            }
            const reviews = await this.monthlyReviewModel.find({
                $or: months.map(m => ({ year: m.year, month: m.month }))
            }).exec() as any[];
            // Tổng hợp theo tháng
            const result = months.map(m => {
                const revs = reviews.filter(r => r.year === m.year && r.month === m.month);
                const averageScore = revs.length > 0 ? revs.reduce((sum, r) => sum + (r.overallScore || 0), 0) / revs.length : 0;
                return {
                    month: `T${m.month}/${m.year}`,
                    averageScore,
                    totalReviews: revs.length
                };
            });
            return BaseResponse.success(result, 'Báo cáo đánh giá hiệu suất', HttpStatus.OK);
        } catch (e) {
            throw new HttpException({ message: e.message }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


}