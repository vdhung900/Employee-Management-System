import { Module } from '@nestjs/common';
import { AttendanceRecordService } from "./attendance.service";
import { AttendanceController } from "./attendance.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { AttendanceRecords, AttendanceRecordSchema } from "src/schemas/attendanceRecords.schema";
import { Account, AccountSchema } from "src/schemas/account.schema";
import { Employees, EmployeesSchema } from "src/schemas/employees.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AttendanceRecords.name, schema: AttendanceRecordSchema },
      { name: Account.name, schema: AccountSchema },
      { name: Employees.name, schema: EmployeesSchema },
    ]),
  ],
  controllers: [AttendanceController],
  providers: [AttendanceRecordService],
})
export class AttendanceModule {}
