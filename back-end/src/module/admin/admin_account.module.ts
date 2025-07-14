import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {AdminAccountController} from './admin_account.controller';
import {AdminAccountService} from './admin_account.service';
import {Account, AccountSchema} from '../../schemas/account.schema';
import {Employees, EmployeesSchema} from '../../schemas/employees.schema';
import {Departments, DepartmentsSchema} from '../../schemas/departments.schema';
import {Position, PositionSchema} from '../../schemas/position.schema';
import {RolePermissionModule} from "../auth/role_permission/role_permission.module";
import {Roles, RoleSchema} from '../../schemas/roles.schema';
import {LeaveSettings, LeaveSettingSchema} from "../../schemas/leaveSettings.schema";
import {LeaveBalance, LeaveBalanceSchema} from "../../schemas/leaveBalance.schema";

@Module({
    imports: [
        MongooseModule.forFeature([{name: Account.name, schema: AccountSchema}, {
            name: Employees.name,
            schema: EmployeesSchema
        }, {name: Departments.name, schema: DepartmentsSchema},
            {name: Position.name, schema: PositionSchema},
            {name: Roles.name, schema: RoleSchema},
            {name: LeaveSettings.name, schema: LeaveSettingSchema},
            {name: LeaveBalance.name, schema: LeaveBalanceSchema},
        ]),
        RolePermissionModule
    ],
    controllers: [AdminAccountController],
    providers: [AdminAccountService],
    exports: [AdminAccountService],

})
export class AdminAccountModule {
}