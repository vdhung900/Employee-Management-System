import { IsOptional, IsString, IsNumber, IsIn, IsMongoId, IsDateString } from "class-validator";
import { Transform } from "class-transformer";
import { ObjectId, Types } from "mongoose";

export class SearchAttendanceDto {
  @IsOptional()
  @IsMongoId({ message: "Invalid employee ID format" })
  employeeId?: string;

  @IsOptional()
  @IsDateString({}, { message: "Invalid start date format" })
  startDate?: string;

  @IsOptional()
  @IsDateString({}, { message: "Invalid end date format" })
  endDate?: string;

  @IsOptional()
  @IsIn(["asc", "desc"])
  sortOrder?: "asc" | "desc";

  @IsOptional()
  @IsString()
  sortBy?: string = "date"; // Mặc định sắp xếp theo ngày

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  limit?: number = 10;

  @IsOptional()
  @IsString()
  status?: string; // filter theo status (present, late, absent, etc.)

  @IsOptional()
  @IsString()
  department?: string; // filter theo phòng ban

  @IsOptional()
  isLate?: boolean; // filter theo đi muộn
}
