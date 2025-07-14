import {Body, Controller, Get, HttpException, HttpStatus, Param, Post} from '@nestjs/common';
import {NotificationService} from './notification.service';
import {BaseResponse} from "../../interfaces/response/base.response";
import {NotificationDto} from "./notification.dto";

@Controller('notification')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {
    }

    @Get(':employeeId')
    async getEmployeeNotifications(@Param('employeeId') employeeId: string): Promise<BaseResponse> {
        try {
            const resData = await this.notificationService.getEmployeeNotifications(employeeId);
            return BaseResponse.success(resData, 'Request retrieved successfully', HttpStatus.OK);
        } catch (e) {
            throw new HttpException({message: e.message}, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('mark-read-one')
    async markReadOne(@Body() req: NotificationDto): Promise<BaseResponse> {
        try {
            const resData = await this.notificationService.markReadOne(req.notificationId, req.employeeId);
            return BaseResponse.success(resData, 'Notification marked as read', HttpStatus.OK);
        } catch (e) {
            throw new HttpException({message: e.message}, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('mark-read-all')
    async markReadAll(@Body() req: NotificationDto): Promise<BaseResponse> {
        try {
            const resData = await this.notificationService.markReadAll(req.employeeId);
            return BaseResponse.success(resData, 'Notification marked as read', HttpStatus.OK);
        } catch (e) {
            throw new HttpException({message: e.message}, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('delete-all')
    async deleteAll(@Body() req: NotificationDto): Promise<BaseResponse> {
        try {
            const resData = await this.notificationService.deleteAllNotifications(req.employeeId);
            return BaseResponse.success(resData, 'Delete success', HttpStatus.OK);
        } catch (e) {
            throw new HttpException({message: e.message}, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}