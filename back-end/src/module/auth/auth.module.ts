import {Module} from "@nestjs/common";
import {AuthController} from "./auth.controller";
import {AuthService} from "./auth.service";
import {MongooseModule} from "@nestjs/mongoose";
import {Account, AccountSchema} from "src/schemas/account.schema";
import {Employees, EmployeesSchema} from "src/schemas/employees.schema";
import {JwtModule} from "@nestjs/jwt";
import {JwtStrategy} from "../../common/strategies/jwt.strategy";
import {ConfigModule} from "@nestjs/config";
import {RolePermissionModule} from "./role_permission/role_permission.module";
import {NotificationModule} from "../notification/notification.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MongooseModule.forFeature([
            {name: Account.name, schema: AccountSchema},
            {name: Employees.name, schema: EmployeesSchema},
        ]),
        JwtModule.register({
            global: true,
        }),
        RolePermissionModule,
        NotificationModule
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports: [],
})
export class AuthModule {
}
