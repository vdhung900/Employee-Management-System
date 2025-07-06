import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Requests, RequestsDocument} from "../../../schemas/requests.schema";
import {Model, Types} from "mongoose";
import {typeRequest, typeRequestDocument} from "../../../schemas/typeRequestCategory.schema";
import {BaseRequestService} from "../base-request.service";
import {CreateRequestDto} from "../dto/createRequest.dto";
import {Departments, DepartmentsDocument} from "../../../schemas/departments.schema";
import {Position, PositionDocument} from "../../../schemas/position.schema";
import {AdminAccountService} from "../../admin/admin_account.service";
import {STATUS} from "../../../enum/status.enum";
import {MailService} from "../../mail/mail.service";
import {UploadService} from "../../minio/minio.service";
import {paginate} from "../../../utils/pagination";
import {AttendanceRecords, AttendanceRecordsDocument} from "../../../schemas/attendanceRecords.schema";
import {getAllWorkingDatesBetween} from "../../../utils/format";
import {MonthlyGoal, MonthlyGoalDocument} from "../../../schemas/monthGoals.schema";
import {Employees, EmployeesDocument} from "../../../schemas/employees.schema";
import {SalaryCoefficient, SalaryCoefficientDocument} from "../../../schemas/salaryCoefficents.schema";
import {SalaryRank, SalaryRankDocument} from "../../../schemas/salaryRank.schema";

@Injectable()
export class RequestManageService {
    constructor(
        @InjectModel(Requests.name) private readonly requestModel: Model<RequestsDocument>,
        @InjectModel(typeRequest.name) private readonly typeRequestModel: Model<typeRequestDocument>,
        @InjectModel(Departments.name) private departmentModel: Model<DepartmentsDocument>,
        @InjectModel(Position.name) private positionModel: Model<PositionDocument>,
        @InjectModel(AttendanceRecords.name) private attendanceRecordModel: Model<AttendanceRecordsDocument>,
        @InjectModel(MonthlyGoal.name) private monthlyGoalModel: Model<MonthlyGoalDocument>,
        @InjectModel(Employees.name) private employeeModel: Model<EmployeesDocument>,
        @InjectModel(SalaryCoefficient.name) private salaryCoefficientModel: Model<SalaryCoefficientDocument>,
        @InjectModel(SalaryRank.name) private salaryRankModel: Model<SalaryRankDocument>,
        private readonly requestService: BaseRequestService,
        private readonly adminAccountService: AdminAccountService,
        private readonly mailService: MailService,
        private readonly uploadService: UploadService,
    ) {
    }

    async getRequestByCode(code: string){
        try{
            const typeRequest = await this.typeRequestModel.findOne({code: code});
            if(!typeRequest){
                throw new Error("Type Request not found");
            }
            const data = await this.requestService.findByTypeCode(new Types.ObjectId(typeRequest.id));
            if (!data || data.length === 0) {
                throw new Error("No requests found for this type");
            }
            let response = {};
            if (code === STATUS.ACCOUNT_CREATE_REQUEST || code === STATUS.LEAVE_REQUEST) {
                response = await Promise.all(
                    data
                        .filter(item => item.status !== 'Cancelled')
                        .map(async (item) => {
                        const department = await this.departmentModel.findById(new Types.ObjectId(item.dataReq.department)).exec();
                        const position = await this.positionModel.findById(new Types.ObjectId(item.dataReq.position)).exec();
                        return {
                            ...item.toObject(),
                            dataReq: {
                                ...item.dataReq,
                                departmentName: department?.name,
                                positionName: position?.name,
                            }
                        };
                    })
                );
            }
            return response;
        }catch (e) {
            throw new Error(e);
        }
    }

    async getRequestByFilter(req: CreateRequestDto){
        try{
            const data = await this.requestService.findByFilterCode(STATUS.ACCOUNT_CREATE_REQUEST);
            const resData = data.filter(item => item.typeRequest !== null);
            return paginate(resData, req?.page, req?.limit);
        }catch (e) {
            throw new Error(e);
        }
    }

    async getRequestByAccountId(req: CreateRequestDto){
        try{
            const requests = await this.requestService.findByEmployeeId(req.employeeId.toString());
            if(!requests || requests.length === 0){
                throw new Error("No requests found for this employee");
            }
            return requests;
        }catch (e) {
            throw new Error(e)
        }
    }

    async createRequest(req: CreateRequestDto){
        try{
            if(!req.typeCode){
                throw new Error("Type Code is required");
            }
            const typeRequest = await this.typeRequestModel.findOne({code: req.typeCode});
            if(!typeRequest){
                throw new Error("Type Request not found");
            }
            if(req.attachments.length > 0){
                const dataRes = await this.uploadService.saveAndReplace(req.attachments);
                req.attachments = dataRes;
            }else{
                req.attachments = [];
            }
            req.typeRequest = new Types.ObjectId(typeRequest?.id);
            req.status = "Pending";

            return await this.requestService.create(req);
        }catch(error){
            throw new Error(error);
        }
    }

    async updateRequest(req: CreateRequestDto){
        try{
            return await this.requestService.update(req.requestId, req);
        }catch(error){
            throw new Error(error);
        }
    }

    async approveRequest(req: CreateRequestDto){
        try{
            await this.requestService.approve(req.requestId, req.status, req.reason);
            const data = await this.requestService.findById(req.requestId);
            const typeRequest = await this.typeRequestModel.findById(data?.typeRequest).exec();
            if(typeRequest && data?.status === STATUS.APPROVED){
                switch(typeRequest?.code){
                    case STATUS.ACCOUNT_CREATE_REQUEST:
                        const account = await this.adminAccountService.createByInfo(data?.dataReq, data.attachments);
                        if(!account){
                            throw new Error("Failed to create account");
                        }
                        await this.mailService.sendMail(
                            account.newEmployee?.email,
                            account.newEmployee?.fullName,
                            account.newAccount?.username,
                            account.newAccount?.password,
                        )
                        break;
                    case STATUS.LEAVE_REQUEST:
                        await this.createAttendanceRecords(req);
                        break;
                    case STATUS.OVERTIME_REQUEST:
                        await this.createAttendanceRecords(req);
                        break;
                    case STATUS.TARGET_REQUEST:
                        await this.createMonthGoals(req, data, typeRequest);
                        break;
                    case STATUS.SALARY_INCREASE:
                        await this.updateCoefficient(req, data, typeRequest);
                        break;
                    default:
                        throw new Error("Trạng thái đơn không hợp lệ!");
                }
            }
            return data;
        }catch(error){
            try{
                await this.requestService.approve(req.requestId, STATUS.REJECTED, error.message);
            }catch (e) {
                console.log(e)
            }
            throw error;
        }
    }

    async createAttendanceRecords(data: CreateRequestDto){
        try{
            const dataRequest = await this.requestService.findById(data.requestId);
            const typeRequest = await this.typeRequestModel.findById(dataRequest?.typeRequest).exec();
            if(!dataRequest){
                throw new Error("Không tìm thấy dữ liệu cần sửa")
            }
            if(dataRequest.dataReq === null || dataRequest.dataReq === undefined){
                throw new Error("Lỗi do không có thông tin chi tiết lịch nghỉ");
            }
            if(typeRequest?.code === STATUS.LEAVE_REQUEST){
                try {
                    const dates: Date[] = getAllWorkingDatesBetween(dataRequest.dataReq.startDate, dataRequest.dataReq.endDate);
                    const checkData = await this.attendanceRecordModel.find({
                        employeeId: dataRequest.employeeId,
                        date: { $in: dates }
                    }).exec();

                    if (checkData.length === 0) {
                        const recordsToInsert = dates.map(date => ({
                            employeeId: dataRequest.employeeId,
                            date: date,
                            isLeave: true,
                            reason: dataRequest.dataReq.reason,
                            note: dataRequest.dataReq.reason,
                            status: STATUS.LEAVE,
                            firstCheckIn: null,
                            lastCheckIn: null,
                        }));

                        await this.attendanceRecordModel.insertMany(recordsToInsert);
                    } else {
                        console.warn('Đã tồn tại dữ liệu chấm công trong khoảng ngày nghỉ');
                    }
                } catch (error) {
                    throw new Error(`Lỗi xử lý ngày nghỉ: ${error.message}`);
                }
            }else if(typeRequest?.code === STATUS.OVERTIME_REQUEST){
                try{
                    const checkData = await this.attendanceRecordModel.findOne({
                        employeeId: dataRequest.employeeId,
                        date: new Date(dataRequest.dataReq.startDate),
                    }).exec();
                    if(checkData){
                        if(checkData.isLeave){
                            throw new Error("Không thể làm thêm giờ ngày này do bạn đã xin nghỉ phép ngày này!");
                        }
                        checkData.isOvertime = true;
                        checkData.overtimeRange = dataRequest.dataReq.hours;
                        checkData.reason = dataRequest.dataReq.reason;
                        await checkData.save();
                    }else{
                        await this.attendanceRecordModel.insertOne({
                            employeeId: dataRequest.employeeId,
                            date: dataRequest.dataReq.startDate,
                            isOvertime: true,
                            overtimeRange: dataRequest.dataReq.hours || [],
                            reason: dataRequest.dataReq.reason,
                            note: dataRequest.dataReq.reason,
                            status: STATUS.OVERTIME,
                        })
                    }
                }catch (e) {
                    throw new Error(e);
                }
            }
        }catch(error){
            throw new Error(error.message || error);
        }
    }

    async createMonthGoals(data: CreateRequestDto, dataRequest: any, typeRequest: any){
        try{
            if(!dataRequest){
                throw new Error("Không tìm thấy dữ liệu cần sửa")
            }
            if(dataRequest.dataReq === null || dataRequest.dataReq === undefined){
                throw new Error("Lỗi do không có thông tin chi tiết lịch nghỉ");
            }
            if(typeRequest.code === STATUS.TARGET_REQUEST){
                const checkData = await this.monthlyGoalModel
                  .findOne({
                    employee_id: dataRequest.employeeId,
                    month: dataRequest.dataReq.month,
                    year: dataRequest.dataReq.year,
                  })
                  .exec();
                if(checkData){
                    const existingTitles = checkData.goals.map(goal => goal.title.trim().toLowerCase());
                    const newUniqueGoals = dataRequest.dataReq.goals.filter(goal => {
                        const title = goal.title.trim().toLowerCase();
                        return !existingTitles.includes(title);
                    });
                    if (newUniqueGoals.length > 0) {
                        checkData.goals.push(...newUniqueGoals);
                        await checkData.save();
                    }
                }else{
                    await this.monthlyGoalModel.insertOne({
                        employee_id: dataRequest.employeeId,
                        month: dataRequest.dataReq.month,
                        year: dataRequest.dataReq.year,
                        goals: dataRequest.dataReq.goals
                    })
                }
            }
        }catch (e) {
            throw new Error(e);
        }
    }

    async updateCoefficient(req: CreateRequestDto, dataRequest: any, typeRequest: any) {
        try {
            if(!dataRequest){
                throw new Error("Không tìm thấy dữ liệu cần sửa")
            }
            if(dataRequest.dataReq === null || dataRequest.dataReq === undefined){
                throw new Error("Lỗi do không có thông tin chi tiết kế hoạch tăng lương");
            }
            if(typeRequest.code === STATUS.SALARY_INCREASE){
                const employee = await this.employeeModel.findById(dataRequest.dataReq?.employeeId).exec();
                if(!employee){
                    throw new Error("Không tìm thấy nhân viên");
                }

                if (employee.timeUpdateSalary) {
                    const lastUpdateTime = new Date(employee.timeUpdateSalary);
                    const currentTime = new Date();
                    const monthsSinceLastUpdate = (currentTime.getFullYear() - lastUpdateTime.getFullYear()) * 12 + 
                        (currentTime.getMonth() - lastUpdateTime.getMonth());
                    
                    if (monthsSinceLastUpdate < 6) {
                        throw new Error("Nhân viên chưa đến kỳ được đề xuất tăng lương");
                    }
                }

                const salaryCoefficient = await this.salaryCoefficientModel.findById(new Types.ObjectId(dataRequest.dataReq?.salaryCoefficientsId)).exec();
                if(!salaryCoefficient){
                    throw new Error("Không tìm thấy hệ số lương");
                }
                if(dataRequest.dataReq?.proposedCoefficient !== salaryCoefficient.salary_coefficient){
                    throw new Error("Hệ số lương đề xuất không hợp lệ");
                }
                employee.salaryCoefficientId = new Types.ObjectId(salaryCoefficient.id);
                employee.timeUpdateSalary = new Date();
                await employee.save();
            }
        } catch (error) {
            throw new Error(error.message || error);
        }
    }
}
