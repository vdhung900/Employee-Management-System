import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminAccountController } from './admin_account.controller';
import { AdminAccountService } from './admin_account.service';
import { Account, AccountSchema } from '../../schemas/account.schema';
import { Employees, EmployeesSchema } from '../../schemas/employees.schema';
import { Departments, DepartmentsSchema } from '../../schemas/departments.schema';
import { Position, PositionSchema } from '../../schemas/position.schema';
import {RolePermissionModule} from "../auth/role_permission/role_permission.module";

@Module({
  imports: [
      MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }, { name: Employees.name, schema: EmployeesSchema }, { name: Departments.name, schema: DepartmentsSchema }, { name: Position.name, schema: PositionSchema } ]),
      RolePermissionModule
  ],
  controllers: [AdminAccountController],
  providers: [AdminAccountService],
  exports: [AdminAccountService],
  
})
export class AdminAccountModule {}
