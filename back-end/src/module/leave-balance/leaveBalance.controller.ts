import {Body, Controller, Get, HttpException, HttpStatus, Param, Post} from '@nestjs/common';
import {BaseResponse} from "../../interfaces/response/base.response";
import {LeaveBalanceService} from "./leaveBalance.service";

@Controller('leave-balance')
export class LeaveBalanceController {
    constructor(private readonly leaveBalanceService: LeaveBalanceService) {
    }

    @Get('get/:employeeId')
    async getLeaveBalanceByEmployeeId(@Param('employeeId') employeeId: string): Promise<BaseResponse> {
        try {
            const resData = await this.leaveBalanceService.getLeaveBalanceByEmpId(employeeId);
            return BaseResponse.success(resData, 'Leave balance retrieved successfully', HttpStatus.OK);
        } catch (e) {
            throw new HttpException({ message: e.message }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
