import { Controller, Post } from '@nestjs/common';
import { SalaryCalculationService } from './salary_calculation.service';

@Controller('salary-calc')
export class SalaryCalculationController {
  constructor(private readonly salaryCalculationService: SalaryCalculationService) {}

  @Post('run')
  async runSalaryCalculation() {
    await this.salaryCalculationService.handleSalaryCalculation();
    return { message: 'Đã tính lương xong!' };
  }
} 