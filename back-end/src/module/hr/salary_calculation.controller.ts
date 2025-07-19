import {Controller, Get, HttpException, HttpStatus, Param, Post} from '@nestjs/common';
import {SalaryCalculationService} from './salary_calculation.service';
import {BaseResponse} from "../../interfaces/response/base.response";

@Controller('salary-calc')
export class SalaryCalculationController {
    constructor(private readonly salaryCalculationService: SalaryCalculationService) {
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
} 