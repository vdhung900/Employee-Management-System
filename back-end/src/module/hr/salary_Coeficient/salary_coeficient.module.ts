import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SalaryCoefficient, SalaryCoefficientSchema } from 'src/schemas/salaryCoefficents.schema';
import { SalaryCoeficientService } from './salary_coeficient.service';
import { SalaryCoeficientController } from './salary_coeficient.controller';
import { SalaryRank, SalaryRankSchema } from 'src/schemas/salaryRank.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SalaryCoefficient.name, schema: SalaryCoefficientSchema },
      { name: SalaryRank.name, schema: SalaryRankSchema },
    ]),
  ],
  controllers: [SalaryCoeficientController],
  providers: [SalaryCoeficientService],
  exports: [SalaryCoeficientService],
})
export class SalaryCoeficientModule {} 