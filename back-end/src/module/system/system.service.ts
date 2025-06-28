import { Injectable } from '@nestjs/common';
import {RequestLog, RequestLogDocument} from "../../schemas/request-log.schema";
import {Model} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";
import {SearchReq} from "../../interfaces/request/searchReq.interface";

interface RequestStats {
    totalRequests: number;
    successRequests: number;
    failedRequests: number;
}

@Injectable()
export class SystemService {
    constructor(
        @InjectModel(RequestLog.name) private requestModel: Model<RequestLogDocument>,
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
                return { startDate, endDate };

            case 'month':
                if (!filter.value) throw new Error('Month number is required');
                const monthStart = new Date(currentYear, filter.value - 1, 1);
                const monthEnd = new Date(currentYear, filter.value, 0);
                monthEnd.setHours(23, 59, 59, 999);
                return { startDate: monthStart, endDate: monthEnd };

            case 'year':
                const yearStart = new Date(currentYear, 0, 1);
                const yearEnd = new Date(currentYear, 11, 31);
                yearEnd.setHours(23, 59, 59, 999);
                return { startDate: yearStart, endDate: yearEnd };

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
            const dateRange = this.getDateRange(req || { type: 'all' });
            
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
}
