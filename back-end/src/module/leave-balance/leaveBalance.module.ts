import { Module } from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import {LeaveSettings, LeaveSettingSchema} from "../../schemas/leaveSettings.schema";
import {LeaveBalance, LeaveBalanceSchema} from "../../schemas/leaveBalance.schema";
import {LeaveBalanceController} from "./leaveBalance.controller";
import {LeaveBalanceService} from "./leaveBalance.service";
import {AdminAccountModule} from "../admin/admin_account.module";

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: LeaveSettings.name, schema: LeaveSettingSchema},
            {name: LeaveBalance.name, schema: LeaveBalanceSchema},
        ]),
        AdminAccountModule
    ],
    providers: [LeaveBalanceService],
    controllers: [LeaveBalanceController]
})
export class LeaveBalanceModule {}
