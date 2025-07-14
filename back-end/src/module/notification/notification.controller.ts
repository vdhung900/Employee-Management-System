import {Controller, Get, HttpException, HttpStatus, Param} from '@nestjs/common';
import {NotificationService} from './notification.service';
import {BaseResponse} from "../../interfaces/response/base.response";

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
}