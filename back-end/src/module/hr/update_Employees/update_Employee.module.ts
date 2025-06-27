import { Module } from "@nestjs/common";
import { UpdateEmployeeController } from "./update_employee.controller";
import { UpdateEmployeeService } from "./update_employee.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Employees, EmployeesSchema } from "../../../schemas/employees.schema";
import { Departments, DepartmentsSchema } from "src/schemas/departments.schema";
import { Position, PositionSchema } from "src/schemas/position.schema";
import { SalaryCoefficient, SalaryCoefficientSchema } from "src/schemas/salaryCoefficents.schema";

@Module({
    imports: [MongooseModule.forFeature([{ name: Employees.name, schema: EmployeesSchema }, { name: Departments.name, schema: DepartmentsSchema }, { name: Position.name, schema: PositionSchema }, { name: SalaryCoefficient.name, schema: SalaryCoefficientSchema }])],
    controllers: [UpdateEmployeeController],
    providers: [UpdateEmployeeService],
    exports: [UpdateEmployeeService],
})  
export class UpdateEmployeeModule {}