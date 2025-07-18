import { Controller, Post, Req, Get, Param, UseGuards, HttpStatus, HttpException, Logger } from '@nestjs/common';
import { SalaryCalculationService } from './salary_calculation.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Types } from 'mongoose';

@Controller('salary-calc')
export class SalaryCalculationController {
  private readonly logger = new Logger(SalaryCalculationController.name);
  constructor(private readonly salaryCalculationService: SalaryCalculationService) {}

  @Post('run')
  async runSalaryCalculation() {
    await this.salaryCalculationService.handleSalaryCalculation();
    return { message: 'Đã tính lương xong!' };
  }

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
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
} 