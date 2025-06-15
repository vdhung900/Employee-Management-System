import {Body, Controller, HttpException, HttpStatus, Post} from '@nestjs/common';
import {HrRequestService} from "./hr-request.service";
import {CreateRequestDto} from "../dto/createRequest.dto";
import {BaseResponse} from "../../../interfaces/response/base.response";

@Controller('hr-request')
export class HrRequestController {
    constructor(
        private readonly hrRequestService: HrRequestService,
    ) {
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

    @Post('/get-by-account-id')
    async getReqByAccountId(@Body() req: CreateRequestDto): Promise<BaseResponse> {
        try {
            const resData = await this.hrRequestService.getRequestByAccountId(req);
            return BaseResponse.success(resData, 'Requests retrieved successfully', HttpStatus.OK);
        } catch (e) {
            throw new HttpException({message: e.message}, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
