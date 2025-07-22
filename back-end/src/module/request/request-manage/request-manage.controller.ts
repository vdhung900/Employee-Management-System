import {Body, Controller, Get, HttpException, HttpStatus, Param, Post, UseGuards} from '@nestjs/common';
import {RequestManageService} from "./request-manage.service";
import {CreateRequestDto} from "../dto/createRequest.dto";
import {BaseResponse} from "../../../interfaces/response/base.response";
import {JwtAuthGuard} from "../../../common/guards/jwt-auth.guard";
import {RolesGuard} from "../../../common/guards/roles.guard";
import {Roles} from "../../../common/decorators/roles.decorator";
import {USER_ROLE} from "../../../enum/role.enum";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('request-manage')
export class RequestManageController {
    constructor(
        private readonly hrRequestService: RequestManageService,
    ) {
    }

    @Get('/get-by-code/:code')
    async getReqByCode(@Param('code') code: string): Promise<BaseResponse> {
        try {
            const resData = await this.hrRequestService.getRequestByCode(code);
            return BaseResponse.success(resData, 'Request retrieved successfully', HttpStatus.OK);
        } catch (e) {
            throw new HttpException({message: e.message}, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('/get-by-filter-code')
    @Roles(USER_ROLE.MANAGER)
    async getReqByFilterCode(@Body() req: CreateRequestDto){
        try {
            const resData = await this.hrRequestService.getRequestByFilter(req);
            return BaseResponse.success(resData, 'Request retrieved successfully', HttpStatus.OK);
        } catch (e) {
            throw new HttpException({message: e.message}, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('/create')
    async createRequest(@Body() req: CreateRequestDto): Promise<BaseResponse>{
        try{
            const resData = await this.hrRequestService.createRequest(req);
            return BaseResponse.success(resData, 'Request created successfully', HttpStatus.CREATED);
        }catch (e) {
            throw new HttpException({message: e.message}, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('/update')
    async updateRequest(@Body() req: CreateRequestDto): Promise<BaseResponse> {
        try {
            const resData = await this.hrRequestService.updateRequest(req);
            return BaseResponse.success(resData, 'Request updated successfully', HttpStatus.OK);
        } catch (e) {
            throw new HttpException({message: e.message}, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('/approve')
    @Roles(USER_ROLE.MANAGER, USER_ROLE.ADMIN, USER_ROLE.HR, USER_ROLE.EMPLOYEE)
    async approveRequest(@Body() req: CreateRequestDto): Promise<BaseResponse>{
        try{
            const resData = await this.hrRequestService.approveRequest(req);
            return BaseResponse.success(resData, 'Request approved successfully', HttpStatus.OK);
        }catch (e) {
            throw new HttpException({message: e.message}, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('/get-by-account-id')
    async getReqByAccountId(@Body() req: CreateRequestDto): Promise<BaseResponse> {
        try {
            const resData = await this.hrRequestService.getRequestByAccountId(req);
            return BaseResponse.success(resData, 'Requests retrieved successfully', HttpStatus.OK);
        } catch (e) {
            throw new HttpException({message: e.message}, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('/leave/by-department/:departmentId')
    async getLeaveRequestsByDepartment(@Param('departmentId') departmentId: string) {
        try {
            const resData = await this.hrRequestService.getLeaveRequestsByDepartment(departmentId);
            return BaseResponse.success(resData, 'Lấy danh sách đơn nghỉ phép theo phòng ban thành công', HttpStatus.OK);
        } catch (e) {
            throw new HttpException({message: e.message}, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('/all-leave-requests')
    async getAllLeaveRequestsForEmployees() {
        try {
            const resData = await this.hrRequestService.getAllLeaveRequestsForEmployees();
            return BaseResponse.success(resData, 'Lấy tất cả đơn nghỉ phép thành công', HttpStatus.OK);
        } catch (e) {
            throw new HttpException({message: e.message}, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
