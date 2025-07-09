import {Body, Controller, Get, HttpException, HttpStatus, Post} from '@nestjs/common';
import {SystemService} from "./system.service";
import {BaseResponse} from "../../interfaces/response/base.response";
import {SearchReq} from "../../interfaces/request/searchReq.interface";
import {SystemSettingDto} from "./dto/systemSetting.dto";
import {LeaveSettingDto} from "./dto/leaveSetting.dto";

@Controller('system')
export class SystemController {
    constructor(private readonly requestManageService: SystemService) {
    }

    @Post('all-logs')
    async searchAll(@Body() req: SearchReq): Promise<BaseResponse> {
        try{
            const resData = await this.requestManageService.getAllRequestLogs(req);
            return BaseResponse.success(resData, "Thành công", HttpStatus.OK);
        }catch (e) {
            throw new HttpException({ message: e.message }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('system-settings/get')
    async getSystemSettings(@Body() req: SystemSettingDto): Promise<BaseResponse> {
        try {
            const resData = await this.requestManageService.getSystemSettings(req);
            return BaseResponse.success(resData, "Lấy cài đặt hệ thống thành công", HttpStatus.OK);
        } catch (e) {
            throw new HttpException({ message: e.message }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('system-settings/create')
    async createSystemSettings(@Body() settings: SystemSettingDto): Promise<BaseResponse> {
        try {
            const resData = await this.requestManageService.createSystemSettings(settings);
            return BaseResponse.success(resData, "Tạo cài đặt hệ thống thành công", HttpStatus.CREATED);
        } catch (e) {
            throw new HttpException({ message: e.message }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('system-settings/update')
    async updateSystemSettings(@Body() settings: SystemSettingDto): Promise<BaseResponse> {
        try {
            const resData = await this.requestManageService.updateSystemSettings(settings);
            return BaseResponse.success(resData, "Cập nhật cài đặt hệ thống thành công", HttpStatus.OK);
        } catch (e) {
            throw new HttpException({ message: e.message }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('system-settings/delete')
    async deleteSystemSettings(@Body() settings: SystemSettingDto): Promise<BaseResponse> {
        try {
            const resData = await this.requestManageService.deleteSystemSettings(settings);
            return BaseResponse.success(resData, "Xoá cài đặt hệ thống thành công", HttpStatus.OK);
        } catch (e) {
            throw new HttpException({ message: e.message }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('leave-settings')
    async getLeaveSettings(): Promise<BaseResponse> {
        try {
            const resData = await this.requestManageService.getLeaveSettings();
            return BaseResponse.success(resData, "Lấy cài đặt nghỉ phép thành công", HttpStatus.OK);
        } catch (e) {
            throw new HttpException({ message: e.message }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('leave-settings/create')
    async createLeaveSettings(@Body() settings: LeaveSettingDto): Promise<BaseResponse> {
        try {
            const resData = await this.requestManageService.createLeaveSettings(settings);
            return BaseResponse.success(resData, "Tạo cài đặt nghỉ phép thành công", HttpStatus.CREATED);
        } catch (e) {
            throw new HttpException({ message: e.message }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('leave-settings/update')
    async updateLeaveSettings(@Body() settings: LeaveSettingDto): Promise<BaseResponse> {
        try {
            const resData = await this.requestManageService.updateLeaveSettings(settings);
            return BaseResponse.success(resData, "Cập nhật cài đặt nghỉ phép thành công", HttpStatus.OK);
        } catch (e) {
            throw new HttpException({ message: e.message }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('leave-settings/delete')
    async deleteLeaveSettings(@Body() settings: LeaveSettingDto): Promise<BaseResponse> {
        try {
            const resData = await this.requestManageService.deleteLeaveSettings(settings);
            return BaseResponse.success(resData, "Xoá cài đặt nghỉ phép thành công", HttpStatus.OK);
        } catch (e) {
            throw new HttpException({ message: e.message }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
