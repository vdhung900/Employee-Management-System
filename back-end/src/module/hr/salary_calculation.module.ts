import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SalaryCalculationService } from './salary_calculation.service';
import { SalaryCalculationController } from './salary_calculation.controller';
import { SalarySlip, SalarySlipSchema } from '../../schemas/salarySlip.schema';
import { Employees, EmployeesSchema } from '../../schemas/employees.schema';
import { AttendanceRecords, AttendanceRecordSchema } from '../../schemas/attendanceRecords.schema';
import { SalaryCoefficient, SalaryCoefficientSchema } from '../../schemas/salaryCoefficents.schema';
import { SalaryRank, SalaryRankSchema } from '../../schemas/salaryRank.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SalarySlip.name, schema: SalarySlipSchema },
      { name: Employees.name, schema: EmployeesSchema },
      { name: AttendanceRecords.name, schema: AttendanceRecordSchema },
      { name: SalaryCoefficient.name, schema: SalaryCoefficientSchema },
      { name: SalaryRank.name, schema: SalaryRankSchema },
    ]),
  ],
  controllers: [SalaryCalculationController],
  providers: [SalaryCalculationService],
  exports: [SalaryCalculationService],
})
export class SalaryCalculationModule {} 