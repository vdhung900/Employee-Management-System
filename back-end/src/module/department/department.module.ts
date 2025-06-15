import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Departments, DepartmentsSchema } from '../../schemas/departments.schema';
import { DepartmentController } from './department.controller';
import { DepartmentService } from './department.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: Departments.name, schema: DepartmentsSchema }])],
    controllers: [DepartmentController],
    providers: [DepartmentService],
})
export class DepartmentModule { } 