import {Injectable} from '@nestjs/common';
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
import {LeaveBalance, LeaveBalanceDocument} from "../../../schemas/leaveBalance.schema";

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
        @InjectModel(LeaveBalance.name) private leaveBalanceModel: Model<LeaveBalanceDocument>,
        private readonly requestService: BaseRequestService,
        private readonly adminAccountService: AdminAccountService,
        private readonly mailService: MailService,
        private readonly uploadService: UploadService,
    ) {
    }

    async getRequestByCode(code: string) {
        try {
            const typeRequest = await this.typeRequestModel.findOne({code: code});
            if (!typeRequest) {
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
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
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
        } catch (e) {
            throw new Error(e);
        }
    }

    async getRequestByFilter(req: CreateRequestDto) {
        try {
            if (!req.departmentId) {
                throw new Error("Phòng ban không hợp lệ");
            }
            const data = await this.requestService.findByFilterCode(req.departmentId.toString(), STATUS.ACCOUNT_CREATE_REQUEST);
            const resData = data
                .filter(item => item.typeRequest !== null)
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            return paginate(resData, req?.page, req?.limit);
        } catch (e) {
            throw new Error(e);
        }
    }

    async getRequestByAccountId(req: CreateRequestDto) {
        try {
            const requests = await this.requestService.findByEmployeeId(req.employeeId.toString());
            if (!requests || requests.length === 0) {
                throw new Error("No requests found for this employee");
            }
            const sorted = requests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            return sorted;
        } catch (e) {
            throw new Error(e)
        }
    }

    async createRequest(req: CreateRequestDto) {
        try {
            if (!req.typeCode) {
                throw new Error("Type Code is required");
            }
            const typeRequest = await this.typeRequestModel.findOne({code: req.typeCode});
            if (!typeRequest) {
                throw new Error("Type Request not found");
            }
            if (req.attachments.length > 0) {
                const dataRes = await this.uploadService.saveAndReplace(req.attachments);
                req.attachments = dataRes;
            } else {
                req.attachments = [];
            }
            req.typeRequest = new Types.ObjectId(typeRequest?.id);
            req.status = STATUS.PENDING;
            const employee = await this.employeeModel.findById(req.employeeId).exec();
            await this.requestService.sendNotification(req, `Yêu cầu ${typeRequest?.name} gửi từ nhân viên ${employee?.fullName}!`);
            return await this.requestService.create(req);
        } catch (error) {
            throw new Error(error);
        }
    }

    async updateRequest(req: CreateRequestDto) {
        try {
            return await this.requestService.update(req.requestId, req);
        } catch (error) {
            throw new Error(error);
        }
    }

    async approveRequest(req: CreateRequestDto) {
        try {
            await this.requestService.approve(req.requestId, req.status, req.reason);
            const data = await this.requestService.findById(req.requestId);
            const typeRequest = await this.typeRequestModel.findById(data?.typeRequest).exec();
            if (typeRequest && data?.status === STATUS.APPROVED) {
                switch (typeRequest?.code) {
                    case STATUS.ACCOUNT_CREATE_REQUEST:
                        const account = await this.adminAccountService.createByInfo(data?.dataReq, data.attachments);
                        if (!account) {
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
                    case STATUS.MATERNITY_LEAVE:
                    case STATUS.MARRIAGE_LEAVE:
                    case STATUS.SICK_LEAVE:
                    case STATUS.UNPAID_LEAVE:
                    case STATUS.PATERNITY_LEAVE:
                    case STATUS.REMOTE_WORK:
                    case STATUS.FUNERAL_LEAVE:
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
        } catch (error) {
            try {
                await this.requestService.approve(req.requestId, STATUS.REJECTED, error.message);
            } catch (e) {
                console.log(e)
            }
            throw error;
        }
    }

    async createAttendanceRecords(data: CreateRequestDto) {
        try {
            const dataRequest = await this.requestService.findById(data.requestId);
            const typeRequest = await this.typeRequestModel.findById(dataRequest?.typeRequest).exec();
            if (!dataRequest) {
                throw new Error("Không tìm thấy dữ liệu cần sửa")
            }
            if (dataRequest.dataReq === null || dataRequest.dataReq === undefined) {
                throw new Error("Lỗi do không có thông tin chi tiết lịch nghỉ");
            }
            if (typeRequest?.code === STATUS.LEAVE_REQUEST ||
                typeRequest?.code === STATUS.MATERNITY_LEAVE ||
                typeRequest?.code === STATUS.MARRIAGE_LEAVE ||
                typeRequest?.code === STATUS.PATERNITY_LEAVE ||
                typeRequest?.code === STATUS.UNPAID_LEAVE ||
                typeRequest?.code === STATUS.FUNERAL_LEAVE ||
                typeRequest?.code === STATUS.SICK_LEAVE) {
                try {
                    let status = this.getStatusAttendance(typeRequest.code);
                    const dates: Date[] = getAllWorkingDatesBetween(dataRequest.dataReq.startDate, dataRequest.dataReq.endDate);
                    const checkData = await this.attendanceRecordModel.find({
                        employeeId: dataRequest.employeeId,
                        date: {$in: dates}
                    }).exec();
                    if (checkData.length === 0) {
                        const leaveBalanceData = await this.leaveBalanceModel.findOne({
                            employeeId: new Types.ObjectId(dataRequest.employeeId),
                            leaveTypeCode: typeRequest.code
                        }).exec();
                        if(leaveBalanceData){
                            const leavePackage = this.checkLeavePackage(dates, leaveBalanceData?.totalAllocated);;
                            const recordsToInsert = [
                                ...leavePackage.paidDates.map(date => ({
                                    employeeId: dataRequest.employeeId,
                                    date: date,
                                    isLeave: true,
                                    reason: dataRequest.dataReq.reason,
                                    note: dataRequest.dataReq.reason,
                                    status: status,
                                    firstCheckIn: null,
                                    lastCheckIn: null,
                                    isPaid: true,
                                })),
                                ...leavePackage.unpaidDates.map(date => ({
                                    employeeId: dataRequest.employeeId,
                                    date: date,
                                    isLeave: true,
                                    reason: dataRequest.dataReq.reason,
                                    note: dataRequest.dataReq.reason,
                                    status: status,
                                    firstCheckIn: null,
                                    lastCheckIn: null,
                                    isPaid: false,
                                })),
                            ];
                            let newTotalBalance = leaveBalanceData.totalAllocated - leavePackage.paidDates.length;
                            if (newTotalBalance < 0) {
                                newTotalBalance = 0;
                            }
                            leaveBalanceData.used = leavePackage.paidDates.length;
                            leaveBalanceData.remaining = newTotalBalance;
                            await leaveBalanceData.save();
                            await this.attendanceRecordModel.insertMany(recordsToInsert);
                        }else{
                            throw new Error("Không tìm thấy dữ liệu số ngày nghỉ phép cho loại yêu cầu này");
                        }
                    } else {
                        console.warn('Đã tồn tại dữ liệu chấm công trong khoảng ngày nghỉ');
                    }
                } catch (error) {
                    throw new Error(`Lỗi xử lý ngày nghỉ: ${error.message}`);
                }
            } else if (typeRequest?.code === STATUS.OVERTIME_REQUEST) {
                try {
                    const checkData = await this.attendanceRecordModel.findOne({
                        employeeId: dataRequest.employeeId,
                        date: new Date(dataRequest.dataReq.startDate),
                    }).exec();
                    if (checkData) {
                        if (checkData.isLeave) {
                            throw new Error("Không thể làm thêm giờ ngày này do bạn đã xin nghỉ phép ngày này!");
                        }
                        checkData.isOvertime = true;
                        checkData.overtimeRange = dataRequest.dataReq.hours;
                        checkData.reason = dataRequest.dataReq.reason;
                        await checkData.save();
                    } else {
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
                } catch (e) {
                    throw new Error(e);
                }
            }
        } catch (error) {
            throw new Error(error.message || error);
        }
    }

    async createMonthGoals(data: CreateRequestDto, dataRequest: any, typeRequest: any) {
        try {
            if (!dataRequest) {
                throw new Error("Không tìm thấy dữ liệu cần sửa")
            }
            if (dataRequest.dataReq === null || dataRequest.dataReq === undefined) {
                throw new Error("Lỗi do không có thông tin chi tiết lịch nghỉ");
            }

            if (typeRequest.code === STATUS.TARGET_REQUEST) {
              const checkData = await this.monthlyGoalModel
                .findOne({
                  employee_id: dataRequest.employeeId._id,
                  month: dataRequest.dataReq.month,
                  year: dataRequest.dataReq.year,
                })
                .exec();
              if (checkData) {
                const existingTitles = checkData.goals.map((goal) =>
                  goal.title.trim().toLowerCase()
                );
                const newUniqueGoals = dataRequest.dataReq.goals.filter((goal) => {
                  const title = goal.title.trim().toLowerCase();
                  return !existingTitles.includes(title);
                });
                const goalsWithCode = newUniqueGoals.map((goal, index) => ({
                  ...goal,
                  code: checkData.goals.length + index,
                }));

                if (newUniqueGoals.length > 0) {
                  checkData.goals.push(...goalsWithCode);
                  await checkData.save();
                }
              } else {
                const goalsWithCode = dataRequest.dataReq.goals.map((goal: any, index: number) => ({
                  ...goal,
                  code: index,
                }));

                await this.monthlyGoalModel.insertOne({
                  employee_id: dataRequest.employeeId._id,
                  month: dataRequest.dataReq.month,
                  year: dataRequest.dataReq.year,
                  goals: goalsWithCode,
                });
              }
            }
        } catch (e) {
            throw new Error(e);
        }
    }

    async updateCoefficient(req: CreateRequestDto, dataRequest: any, typeRequest: any) {
        try {
            if (!dataRequest) {
                throw new Error("Không tìm thấy dữ liệu cần sửa")
            }
            if (dataRequest.dataReq === null || dataRequest.dataReq === undefined) {
                throw new Error("Lỗi do không có thông tin chi tiết kế hoạch tăng lương");
            }
            if (typeRequest.code === STATUS.SALARY_INCREASE) {
                const employee = await this.employeeModel.findById(dataRequest.dataReq.employeeId).exec();
                if (!employee) {
                    throw new Error("Không tìm thấy nhân viên");
                }

                if (employee.timeUpdateSalary !== null) {
                    const lastUpdateTime = new Date(employee.timeUpdateSalary);
                    const currentTime = new Date();
                    const monthsSinceLastUpdate = (currentTime.getFullYear() - lastUpdateTime.getFullYear()) * 12 +
                        (currentTime.getMonth() - lastUpdateTime.getMonth());

                    if (monthsSinceLastUpdate < 6) {
                        throw new Error("Nhân viên chưa đến kỳ được đề xuất tăng lương");
                    }
                }

                const salaryCoefficient = await this.salaryCoefficientModel.findById(new Types.ObjectId(dataRequest.dataReq?.salaryCoefficientsId)).exec();
                if (!salaryCoefficient) {
                    throw new Error("Không tìm thấy hệ số lương");
                }
                if (dataRequest.dataReq?.proposedCoefficient !== salaryCoefficient.salary_coefficient) {
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

    async getLeaveRequestsByDepartment(departmentId: string) {
        // Lấy typeRequestId của LEAVE_REQUEST
        const leaveType = await this.typeRequestModel.findOne({ code: 'LEAVE_REQUEST' });
        if (!leaveType) throw new Error('Không tìm thấy loại đơn nghỉ phép');

        // Lấy tất cả nhân viên thuộc phòng ban này
        const employees = await this.employeeModel.find({ departmentId: new Types.ObjectId(departmentId) }).select('_id');
        const employeeIds = employees.map(e => e._id);

        // Lấy tất cả đơn nghỉ phép của các nhân viên này
        const leaveRequests = await this.requestModel.find({
            typeRequest: leaveType._id,
            employeeId: { $in: employeeIds }
        });

        return leaveRequests;
    }

    checkLeavePackage(requestDates: Date[], leaveBalance: number) {
        try {
            const paidDates = requestDates.slice(0, leaveBalance);
            const unpaidDates = requestDates.slice(leaveBalance);
            return { paidDates, unpaidDates };
        } catch (e) {
            throw new Error(e.message || e);
        }
    }

    getStatusAttendance(typeRequest: string){
        let status = '';
        switch (typeRequest) {
            case STATUS.LEAVE_REQUEST:
                status = STATUS.LEAVE;
                break;
            case STATUS.MATERNITY_LEAVE:
                status = STATUS.NGHI_THAI_SAN;
                break;
            case STATUS.MARRIAGE_LEAVE:
                status = STATUS.NGHI_CUOI;
                break;
            case STATUS.PATERNITY_LEAVE:
                status = STATUS.NGHI_VO_SINH;
                break;
            case STATUS.UNPAID_LEAVE:
                status = STATUS.NGHI_KHONG_LUONG;
                break;
            case STATUS.FUNERAL_LEAVE:
                status = STATUS.NGHI_TANG;
                break;
            case STATUS.SICK_LEAVE:
                status = STATUS.NGHI_OM;
                break;
            default:
                status = '';
        }
        return status;
    }
}
