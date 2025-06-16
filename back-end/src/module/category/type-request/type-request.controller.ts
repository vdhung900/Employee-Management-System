import {Controller, Get, HttpException, HttpStatus, Param} from '@nestjs/common';
import {TypeRequestService} from "./type-request.service";
import {BaseResponse} from "../../../../../../tesst/Employee-Management-System/back-end/src/interfaces/response/base.response";

@Controller('category/type-request')
export class TypeRequestController {
    constructor(
        private readonly typeRequestService: TypeRequestService,
    ) {
    }

    @Get('/:role')
    async getByRole(@Param('role') role: string): Promise<BaseResponse>{
        try{
            const resData = await this.typeRequestService.getTypeReqByRole(role);
            return BaseResponse.success(resData, 'Get type request by role successfully', HttpStatus.OK);
        }catch (e) {
            throw new HttpException({ message: e.message }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
