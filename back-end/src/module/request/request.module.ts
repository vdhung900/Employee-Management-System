import { Module } from '@nestjs/common';
import { BaseRequestService } from './base-request.service';
import {MongooseModule} from "@nestjs/mongoose";
import {Requests, RequestsSchema} from "../../schemas/requests.schema";
import {typeRequest, typeRequestSchema} from "../../schemas/typeRequestCategory.schema";
import { RequestManageController } from './request-manage/request-manage.controller';
import { RequestManageService } from './request-manage/request-manage.service';
import {Departments, DepartmentsSchema} from "../../schemas/departments.schema";
import {Position, PositionSchema} from "../../schemas/position.schema";
import {AdminAccountModule} from "../admin/admin_account.module";
import {MailModule} from "../mail/mail.module";
import {Documents, DocumentsSchema} from "../../schemas/documents.schema";
import {UploadModule} from "../minio/minio.module";
import {AttendanceRecords, AttendanceRecordSchema} from "../../schemas/attendanceRecords.schema";
import {MonthlyGoal, MonthlyGoalSchema} from "../../schemas/monthGoals.schema";
import {SalaryCoefficient, SalaryCoefficientSchema} from "../../schemas/salaryCoefficents.schema";
import {SalaryRank, SalaryRankSchema} from "../../schemas/salaryRank.schema";
import {Employees, EmployeesSchema} from "../../schemas/employees.schema";
import {LeaveBalance, LeaveBalanceSchema} from "../../schemas/leaveBalance.schema";
import {NotificationModule} from "../notification/notification.module";
import {SalarySlip, SalarySlipSchema} from "../../schemas/salarySlip.schema";

@Module({
  imports: [
      MongooseModule.forFeature([
        {name: Requests.name, schema: RequestsSchema},
        {name: typeRequest.name, schema: typeRequestSchema},
          { name: Departments.name, schema: DepartmentsSchema }, { name: Position.name, schema: PositionSchema },
          {name: Documents.name, schema: DocumentsSchema },
          {name: AttendanceRecords.name, schema: AttendanceRecordSchema },
          {name: MonthlyGoal.name, schema: MonthlyGoalSchema },
          {name: SalaryCoefficient.name, schema: SalaryCoefficientSchema },
          {name: SalaryRank.name, schema: SalaryRankSchema },
          {name: Employees.name, schema: EmployeesSchema },
          {name: LeaveBalance.name, schema: LeaveBalanceSchema },
          {name: SalarySlip.name, schema: SalarySlipSchema },
      ]),
      AdminAccountModule,
      MailModule,
      UploadModule,
      NotificationModule
  ],
  providers: [BaseRequestService, RequestManageService],
  controllers: [RequestManageController]
})
export class RequestModule {}
