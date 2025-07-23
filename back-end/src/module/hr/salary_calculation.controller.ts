import {Controller, Post, Req, Get, Param, UseGuards, HttpStatus, HttpException, Logger, Body} from '@nestjs/common';
import { SalaryCalculationService } from './salary_calculation.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Types } from 'mongoose';
import { USER_ROLE } from 'src/enum/role.enum';
import {Roles} from "../../common/decorators/roles.decorator";
import {RolesGuard} from "../../common/guards/roles.guard";
import {BaseResponse} from "../../interfaces/response/base.response";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('salary-calc')
export class SalaryCalculationController {
    constructor(private readonly salaryCalculationService: SalaryCalculationService) {
    }
  private readonly logger = new Logger(SalaryCalculationController.name);

  @Post('sign')
  async signPdf(@Body() dto: { month: string; signatureImage: string; originalHash: string }) : Promise<BaseResponse>{
    try{
      const { month, signatureImage, originalHash } = dto;
      const resData = await this.salaryCalculationService.signSalarySlip(month, signatureImage, originalHash);
      return BaseResponse.success(resData, 'Ký thành công!', HttpStatus.OK);
    }catch (e) {
      throw new HttpException({ message: e.message }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('sign-by-manage')
  async signPdfByManage(@Body() dto: { requestId: string; signatureImage: string; status: string }) : Promise<BaseResponse>{
    try{
      const { requestId, signatureImage, status } = dto;
      const resData = await this.salaryCalculationService.signSalarySlipByManage(requestId, signatureImage, status);
      return BaseResponse.success(resData, 'Duyệt và ký thành công!', HttpStatus.OK);
    }catch (e) {
      throw new HttpException({ message: e.message }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
  @Get('generate-pdf/:month')
  async generatePdf(@Param('month') month: string) : Promise<BaseResponse>{
    try{
      const resData = await this.salaryCalculationService.generatePdfBase64(month);
      return BaseResponse.success(resData, 'Xem trước thành công', HttpStatus.OK);
    }catch (e) {
      throw new HttpException({ message: e.message }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

    @Post('run')
    async runSalaryCalculation(): Promise<BaseResponse> {
        try {
            await this.salaryCalculationService.handleSalaryCalculation();
            return BaseResponse.success(null, 'Đã tính lương xong!', HttpStatus.OK);
        } catch (e) {
            throw new HttpException({error: e.message}, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('get-by-month/:month')
    async getSalaryByMonth(@Param('month') month: string): Promise<BaseResponse> {
        try {
            const resData = await this.salaryCalculationService.getSalarySlipByMonth(month);
            return BaseResponse.success(resData, 'Lấy lương theo tháng thành công!', HttpStatus.OK);
        } catch (e) {
            throw new HttpException({error: e.message}, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

  @Get('slip')
  async getMySalarySlips(@Req() req: any) {
    try {
      const employeeId = req.user?.employeeId;
      if (!employeeId) throw new HttpException('Không tìm thấy employeeId trong token', HttpStatus.UNAUTHORIZED);
      // Đảm bảo truyền ObjectId cho truy vấn
      const slips = await this.salaryCalculationService.getSalarySlipsByEmployee(employeeId);
      return { success: true, data: slips };
    } catch (e) {
      throw new HttpException({ message: e.message }, e.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('slip/:id')
  async getSalarySlipById(@Param('id') id: string) {
    try {
      const slip = await this.salaryCalculationService.getSalarySlipById(id);
      if (!slip) throw new HttpException('Không tìm thấy salary slip', HttpStatus.NOT_FOUND);
      return { success: true, data: slip };
    } catch (e) {
      throw new HttpException({ message: e.message }, e.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('slips')
  @Roles(USER_ROLE.HR)
  async getAllSalarySlips() {
    try {
      const slips = await this.salaryCalculationService.getAllSalarySlips();
      return { success: true, data: slips };
    } catch (e) {
      throw new HttpException({ message: e.message }, e.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('slips/department/:departmentId')
  @Roles(USER_ROLE.MANAGER)
  async getSalarySlipsByDepartment(@Param('departmentId') departmentId: string) {
    try {
      const slips = await this.salaryCalculationService.getSalarySlipsByDepartment(departmentId);
      return { success: true, data: slips };
    } catch (e) {
      throw new HttpException({ message: e.message }, e.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}