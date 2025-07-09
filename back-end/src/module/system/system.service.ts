import {Injectable} from '@nestjs/common';
import {RequestLog, RequestLogDocument} from "../../schemas/request-log.schema";
import {Model} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";
import {SearchReq} from "../../interfaces/request/searchReq.interface";
import {SystemSetting, SystemSettingDocument} from "../../schemas/systemSetting.schema";
import {LeaveSettingDocument, LeaveSettings} from "../../schemas/leaveSettings.schema";
import {SystemSettingDto} from "./dto/systemSetting.dto";
import {LeaveSettingDto} from "./dto/leaveSetting.dto";

interface RequestStats {
    totalRequests: number;
    successRequests: number;
    failedRequests: number;
}

@Injectable()
export class SystemService {
    constructor(
        @InjectModel(RequestLog.name) private requestModel: Model<RequestLogDocument>,
        @InjectModel(SystemSetting.name) private systemSettingModel: Model<SystemSettingDocument>,
        @InjectModel(LeaveSettings.name) private leaveSettingModel: Model<LeaveSettingDocument>,
    ) {
    }

    private getDateRange(filter: SearchReq): { startDate: Date; endDate: Date } {
        const now = new Date();
        const currentYear = filter.year || now.getFullYear();

        switch (filter.type) {
            case 'week':
                if (!filter.value) throw new Error('Week number is required');
                const startDate = new Date(currentYear, 0, 1 + (filter.value - 1) * 7);
                const endDate = new Date(startDate);
                endDate.setDate(endDate.getDate() + 6);
                endDate.setHours(23, 59, 59, 999);
                return {startDate, endDate};

            case 'month':
                if (!filter.value) throw new Error('Month number is required');
                const monthStart = new Date(currentYear, filter.value - 1, 1);
                const monthEnd = new Date(currentYear, filter.value, 0);
                monthEnd.setHours(23, 59, 59, 999);
                return {startDate: monthStart, endDate: monthEnd};

            case 'year':
                const yearStart = new Date(currentYear, 0, 1);
                const yearEnd = new Date(currentYear, 11, 31);
                yearEnd.setHours(23, 59, 59, 999);
                return {startDate: yearStart, endDate: yearEnd};

            case 'custom':
                if (!filter.startDate || !filter.endDate) {
                    throw new Error('startDate and endDate are required for custom date range');
                }
                const customEndDate = new Date(filter.endDate);
                customEndDate.setHours(23, 59, 59, 999);
                return {
                    startDate: filter.startDate,
                    endDate: customEndDate
                };

            case 'all':
            default:
                return {
                    startDate: new Date(0), // Beginning of time
                    endDate: new Date(8640000000000000) // End of time
                };
        }
    }

    async getAllRequestLogs(req?: SearchReq) {
        try {
            const dateRange = this.getDateRange(req || {type: 'all'});

            const dataLog = await this.requestModel.find({
                createdAt: {
                    $gte: dateRange.startDate,
                    $lte: dateRange.endDate
                }
            });

            if (dataLog.length < 1) {
                throw new Error("No data log found for the selected period.");
            }

            const logsByDate: Record<string, RequestStats> = {};
            dataLog.forEach(log => {
                const date = log.createdAt.toISOString().split('T')[0];
                if (!logsByDate[date]) {
                    logsByDate[date] = {
                        totalRequests: 0,
                        successRequests: 0,
                        failedRequests: 0
                    };
                }

                logsByDate[date].totalRequests++;
                if (log.statusCode >= 200 && log.statusCode < 300) {
                    logsByDate[date].successRequests++;
                } else {
                    logsByDate[date].failedRequests++;
                }
            });

            const mockData = Object.entries(logsByDate).map(([date, stats]) => ({
                date,
                totalRequests: stats.totalRequests,
                successRequests: stats.successRequests,
                failedRequests: stats.failedRequests
            }));

            // Prepare pagination for detailLog
            const page = req?.page || 1;
            const limit = req?.limit || 10;
            const totalItems = dataLog.length;
            const totalPages = Math.ceil(totalItems / limit);
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;

            const paginatedLogs = dataLog.slice(startIndex, endIndex).map(log => ({
                method: log.method,
                url: log.url,
                statusCode: log.statusCode,
                ipAddress: log.ipAddress,
                responseTime: log.responseTime,
                createdAt: log.createdAt,
                userId: log.userId
            }));

            return {
                mockData,
                detailLog: {
                    content: paginatedLogs,
                    page: page,
                    limit: limit,
                    totalItems: totalItems,
                    totalPages: totalPages
                }
            };
        } catch (e) {
            throw new Error(`Error fetching request logs: ${e.message}`);
        }
    }

    async getSystemSettings(req: SystemSettingDto) {
        try {
            const data = await this.systemSettingModel.find({type: req.type}).exec();
            if (!data || data.length === 0) {
                throw new Error('Không tìm thấy cài đặt hệ thống!');
            }
            return data;
        } catch (e) {
            throw new Error(e);
        }
    }

    async createSystemSettings(dto: SystemSettingDto){
        try{
            const newSetting = new this.systemSettingModel({
                key: dto.key,
                value: dto.value,
                type: dto.type
            })
            return await newSetting.save();
        }catch (e) {
            throw new Error(e)
        }
    }

    async updateSystemSettings(dto: SystemSettingDto) {
        try {
            const updateSetting = await this.systemSettingModel.findById(dto.systemSettingId).exec();
            if (!updateSetting) {
                throw new Error('Không tìm thấy cac cài đặt hệ thống!');
            }
            updateSetting.key = dto.key;
            updateSetting.value = dto.value;
            updateSetting.type = dto.type;
            return await updateSetting.save();
        } catch (e) {
            throw new Error(e);
        }
    }

    async deleteSystemSettings(dto: SystemSettingDto) {
        try{
            return await this.systemSettingModel.findByIdAndDelete(dto.systemSettingId).exec();
        }catch (e) {
            throw new Error(e)
        }
    }

    async getLeaveSettings() {
        try {
            const data = await this.leaveSettingModel.find().exec();
            return data;
        } catch (e) {
            throw new Error(e);
        }
    }

    async createLeaveSettings(dto: LeaveSettingDto) {
        try{
            const newLeaveSetting = new this.leaveSettingModel({
                code: dto.code,
                name: dto.name,
                description: dto.description,
                maxDaysPerYear: dto.maxDaysPerYear,
                isPaid: dto.isPaid,
                note: dto.note
            })
            return await newLeaveSetting.save();
        }catch (e) {
            throw new Error(e)
        }
    }

    async updateLeaveSettings(dto: LeaveSettingDto) {
        try {
            const updateLeaveSetting = await this.leaveSettingModel.findById(dto.leaveSettingId).exec();
            if (!updateLeaveSetting) {
                throw new Error('Không tìm thấy cài đặt nghỉ phép!');
            }
            updateLeaveSetting.code = dto.code;
            updateLeaveSetting.name = dto.name;
            updateLeaveSetting.description = dto.description;
            updateLeaveSetting.maxDaysPerYear = dto.maxDaysPerYear;
            updateLeaveSetting.isPaid = dto.isPaid;
            updateLeaveSetting.note = dto.note;
            return await updateLeaveSetting.save();
        } catch (e) {
            throw new Error(e);
        }
    }

    async deleteLeaveSettings(dto: LeaveSettingDto) {
        try{
            return await this.leaveSettingModel.findByIdAndDelete(dto.leaveSettingId).exec();
        }catch (e) {
            throw new Error(e)
        }
    }
}
