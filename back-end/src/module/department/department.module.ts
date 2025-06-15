import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Departments, DepartmentsSchema } from '../../schemas/departments.schema';
import { DepartmentController } from './department.controller';
import { DepartmentService } from './department.service';
import { Account, AccountSchema } from '../../schemas/account.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Departments.name, schema: DepartmentsSchema },
            { name: Account.name, schema: AccountSchema }
        ])
    ],
    controllers: [DepartmentController],
    providers: [DepartmentService],
})
export class DepartmentModule { } 