import {Controller, Get, Put, Param, Body, HttpStatus, HttpException, UseGuards, Post} from '@nestjs/common';
import {DocumentManageService} from "./documentManage.service";
import {BaseResponse} from "../../../interfaces/response/base.response";
import {JwtAuthGuard} from "../../../common/guards/jwt-auth.guard";
import {RolesGuard} from "../../../common/guards/roles.guard";
import {Roles} from "../../../common/decorators/roles.decorator";
import {USER_ROLE} from "../../../enum/role.enum";
import {DocumentManageDto} from "./documentManage.dto";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('hr/document-manage')
export class DocumentManageController {
    constructor(private readonly documentManageService: DocumentManageService) {}

    @Get('/employees')
    @Roles(USER_ROLE.HR)
    async getEmployeesAndDocument(): Promise<BaseResponse>{
        try{
            const resData = await this.documentManageService.getAllEmployeesAndDocuments();
            return BaseResponse.success(resData, 'Lấy danh sách nhân viên và tài liệu thành công', HttpStatus.OK);
        }catch (e) {
            throw new HttpException({message: e.message}, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('/add')
    @Roles(USER_ROLE.HR)
    async addDocumentForEmployee(@Body() req: DocumentManageDto): Promise<BaseResponse> {
        try {
            const resData = await this.documentManageService.addDocumentForEmployee(req);
            return BaseResponse.success(resData, 'Thêm tài liệu cho nhân viên thành công', HttpStatus.CREATED);
        } catch (e) {
            throw new HttpException({message: e.message}, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('/delete')
    @Roles(USER_ROLE.HR)
    async deleteDocumentForEmployee(@Body() req: DocumentManageDto): Promise<BaseResponse> {
        try {
            const resData = await this.documentManageService.deleteDocumentForEmployee(req);
            return BaseResponse.success(resData, 'Xóa tài liệu cho nhân viên thành công', HttpStatus.OK);
        } catch (e) {
            throw new HttpException({message: e.message}, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}