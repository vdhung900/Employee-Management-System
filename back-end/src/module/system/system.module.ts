import { Module } from '@nestjs/common';
import { SystemService } from './system.service';
import { SystemController } from './system.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {RequestLog, RequestLogSchema} from "../../schemas/request-log.schema";
import {SystemSetting, SystemSettingSchema} from "../../schemas/systemSetting.schema";
import {LeaveSettings, LeaveSettingSchema} from "../../schemas/leaveSettings.schema";
import {Employees, EmployeesSchema} from "../../schemas/employees.schema";
import {Requests, RequestsSchema} from "../../schemas/requests.schema";
import {Departments, DepartmentsSchema} from "../../schemas/departments.schema";
import {Position, PositionSchema} from "../../schemas/position.schema";
import {Contract, ContractSchema} from "../../schemas/contracts.schema";
import {AttendanceRecords, AttendanceRecordSchema} from "../../schemas/attendanceRecords.schema";
import {MonthlyGoal, MonthlyGoalSchema} from "../../schemas/monthGoals.schema";
import {Notification, NotificationSchema} from "../../schemas/notification.schema";

@Module({
  imports: [
      MongooseModule.forFeature([
        {name: RequestLog.name, schema: RequestLogSchema},
        {name: SystemSetting.name, schema: SystemSettingSchema},
        {name: LeaveSettings.name, schema: LeaveSettingSchema},
        {name: Employees.name, schema: EmployeesSchema},
        {name: Requests.name, schema: RequestsSchema},
        {name: Departments.name, schema: DepartmentsSchema},
        {name: Position.name, schema: PositionSchema},
        {name: Contract.name, schema: ContractSchema},
        {name: AttendanceRecords.name, schema: AttendanceRecordSchema},
        {name: MonthlyGoal.name, schema: MonthlyGoalSchema},
        {name: Notification.name, schema: NotificationSchema},
      ])
  ],
  providers: [SystemService],
  controllers: [SystemController]
})
export class SystemModule {}
