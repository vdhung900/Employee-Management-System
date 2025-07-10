import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Employees, EmployeesSchema } from 'src/schemas/employees.schema';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: Employees.name, schema: EmployeesSchema }])],
    controllers: [EmployeeController],
    providers: [EmployeeService],
    exports: [EmployeeService],
})
export class EmployeeModule {} 