import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Employees, EmployeesSchema } from 'src/schemas/employees.schema';
import { Departments, DepartmentsSchema } from 'src/schemas/departments.schema';
import { Position, PositionSchema } from 'src/schemas/position.schema';
import { SalaryCoefficient, SalaryCoefficientSchema } from 'src/schemas/salaryCoefficents.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: Employees.name, schema: EmployeesSchema }, { name: Departments.name, schema: DepartmentsSchema }, { name: Position.name, schema: PositionSchema }, { name: SalaryCoefficient.name, schema: SalaryCoefficientSchema }])],
    controllers: [ProfileController],
    providers: [ProfileService],
    exports: [ProfileService],
})
export class ProfileModule {}