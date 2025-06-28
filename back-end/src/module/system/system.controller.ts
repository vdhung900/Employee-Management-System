import {Body, Controller, Get, HttpException, HttpStatus, Post} from '@nestjs/common';
import {SystemService} from "./system.service";
import {BaseResponse} from "../../interfaces/response/base.response";
import {SearchReq} from "../../interfaces/request/searchReq.interface";

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
}
