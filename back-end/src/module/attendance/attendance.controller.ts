import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  BadRequestException,
} from "@nestjs/common";
import { AttendanceRecordService } from "./attendance.service";
import { CreateAttendanceRecordDto } from "./dto/create-attendance.dto";
import { UpdateAttendanceRecordDto } from "./dto/update-attendance.dto";
import { BaseResponse } from "src/interfaces/response/base.response";
import { InjectModel } from "@nestjs/mongoose";
import { EmployeesDocument } from "src/schemas/employees.schema";

@Controller("attendance")
export class AttendanceController {
  constructor(private readonly attendanceRecordService: AttendanceRecordService) {}

  @Post("check-in")
  async checkIn(@Req() req: any): Promise<BaseResponse> {
    try {
      const createAttendanceDto = new CreateAttendanceRecordDto();

      //Authorization (temporary)

      // Check if attendance record already exists for today
      // const employee =
      const existingRecord = await this.attendanceRecordService.findByEmployeeIdToday(
        req.user.userId
      );
      if (existingRecord) {
        throw new BadRequestException(
          "Attendance record for this person already exists for today."
        );
      }

      //Attach data to the DTO
      const now = new Date();
      createAttendanceDto.employeeId = req.user.userId; // Set employeeId from the authenticated user
      createAttendanceDto.date = now; // Set the current date
      createAttendanceDto.firstCheckIn = now; // Set the check-in time to now

      const eightAM = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0, 0);
      createAttendanceDto.isLate = createAttendanceDto.firstCheckIn > eightAM;

      // Create a new attendance record
      const savedRecord = await this.attendanceRecordService.create(createAttendanceDto);
      return BaseResponse.success(savedRecord, "Attendance record created successfully", 201);
    } catch (error) {
      console.error("Error creating attendance record:", error);
      throw error; // Re-throw the error to be handled by NestJS
    }
  }

  @Post("check-out")
  async checkOut(@Req() req: any): Promise<BaseResponse> {
    try {
      const updateDto = new UpdateAttendanceRecordDto();

      // Check if the employee has an existing attendance record for today
      const existingRecord = await this.attendanceRecordService.findByEmployeeIdToday(
        req.user.userId
      );

      if (!existingRecord) {
        //not checked in today
        throw new BadRequestException("No attendance record found for this person today.");
      }

      //Attach data to the DTO and update the existing record
      updateDto.lastCheckOut = new Date(); // Set the check-out time to now
      updateDto.totalWorkingHours = Math.abs(
        (updateDto.lastCheckOut.getTime() - existingRecord.firstCheckIn.getTime()) / 36e5
      ); // Calculate total working hours in hours
      const updatedRecord = await this.attendanceRecordService.update(existingRecord.id, updateDto);

      return BaseResponse.success(updatedRecord, "Attendance record updated successfully", 200);
    } catch (error) {
      console.error("Error creating attendance record:", error);
      throw error; // Re-throw the error to be handled by NestJS
    }
  }

  @Get("today")
  async getTodayAttendance(@Req() req: any): Promise<BaseResponse> {
    try {

      const todayRecord = await this.attendanceRecordService.findByEmployeeIdToday(
        req.user.userId
      );

      if (!todayRecord) {
        return BaseResponse.success(null, "No attendance record found for today", 200);
      }

      return BaseResponse.success(todayRecord, "Today attendance record retrieved successfully", 200);
    } catch (error) {
      console.error("Error retrieving today attendance record:", error);
      throw error;
    }
  }

  @Get()
  async findAll() {
    const attendanceRecords = await this.attendanceRecordService.findAll();
    return BaseResponse.success(
      attendanceRecords,
      "Attendance records retrieved successfully",
      200
    );
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.attendanceRecordService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateAttendanceDto: UpdateAttendanceRecordDto) {
    return this.attendanceRecordService.update(+id, updateAttendanceDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.attendanceRecordService.remove(+id);
  }
}
