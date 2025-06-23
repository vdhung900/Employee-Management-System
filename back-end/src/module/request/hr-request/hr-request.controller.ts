import {Body, Controller, Get, HttpException, HttpStatus, Param, Post} from '@nestjs/common';
import {HrRequestService} from "./hr-request.service";
import {CreateRequestDto} from "../dto/createRequest.dto";
import {BaseResponse} from "../../../interfaces/response/base.response";

@Controller('hr-request')
export class HrRequestController {
    constructor(
        private readonly hrRequestService: HrRequestService,
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
}
