import {Body, Controller, Get, HttpException, HttpStatus, Post} from '@nestjs/common';
import {RequestManageService} from "./request-manage.service";
import {BaseResponse} from "../../interfaces/response/base.response";
import {SearchReq} from "../../interfaces/request/searchReq.interface";

@Controller('request-manage')
export class RequestManageController {
    constructor(private readonly requestManageService: RequestManageService) {
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
