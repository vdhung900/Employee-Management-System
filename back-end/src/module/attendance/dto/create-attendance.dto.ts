import { IsNotEmpty, IsMongoId, IsOptional, IsString, IsDate, IsNumber } from "class-validator";

import { Type } from "class-transformer";

export class CreateAttendanceRecordDto {
  @IsNotEmpty({ message: "Employee ID is required" })
  @IsMongoId({ message: "Invalid employee ID format" })
  employeeId: string;

  @IsNotEmpty({ message: "Check-in time is required" })
  @IsDate()
  date: Date;

  @IsOptional()
  @IsDate()
  firstCheckIn: Date;

  @IsOptional()
  @IsDate()
  lastCheckOut: Date;

  @IsOptional()
  @IsNumber()
  totalWorkingHours: number;

  @IsOptional()
  @IsString()
  leaveType?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  note?: string;
}
