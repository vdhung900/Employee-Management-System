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
  Query,
} from "@nestjs/common";
import { AttendanceRecordService } from "./attendance.service";
import { CreateAttendanceRecordDto } from "./dto/create-attendance.dto";
import { UpdateAttendanceRecordDto } from "./dto/update-attendance.dto";
import { SearchAttendanceDto } from "./dto/search-attendance.dto";
import { BaseResponse } from "src/interfaces/response/base.response";
import { InjectModel } from "@nestjs/mongoose";
import { EmployeesDocument } from "src/schemas/employees.schema";
import { STATUS } from "src/enum/status.enum";

@Controller("attendance")
export class AttendanceController {
  constructor(private readonly attendanceRecordService: AttendanceRecordService) {}

  @Post("check-in")
  async checkIn(@Req() req: any): Promise<BaseResponse> {
    try {
      const createAttendanceDto = new CreateAttendanceRecordDto();
      //Authorization (temporary)

      const existingRecord = await this.attendanceRecordService.findByEmployeeIdToday(
        req.user.employeeId
      );
      if (existingRecord) {
        throw new BadRequestException(
          "Attendance record for this person already exists for today."
        );
      }

      //Attach data to the DTO
      const now = new Date();
      createAttendanceDto.employeeId = req.user.employeeId; // Set employeeId from the authenticated user
      createAttendanceDto.date = now; // Set the current date
      createAttendanceDto.firstCheckIn = now; // Set the check-in time to now

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
        req.user.employeeId
      );

      if (!existingRecord) {
        //not checked in today
        throw new BadRequestException("No attendance record found for this person today.");
      }

      //Mặc định khi checkin, tạo Record là LEAVE
      if (existingRecord.status !== STATUS.LEAVE) {
        throw new BadRequestException("Không thể checkout");
      }

      //Attach data to the DTO and update the existing record
      const now = new Date();
      const time_8h30 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 30, 0);
      const time_17h30 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 17, 30, 0);

      if (existingRecord.firstCheckIn > time_8h30) {
        updateDto.status = STATUS.LATE;
      } else if (now < time_17h30) {
        updateDto.status = STATUS.VE_SOM;
      } else {
        updateDto.status = STATUS.PRESENT;
      }

      updateDto.lastCheckOut = now; // Set the check-out time to now

      if (updateDto.lastCheckOut)
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
        req.user.employeeId
      );

      if (!todayRecord) {
        return BaseResponse.success(null, "No attendance record found for today", 200);
      }

      return BaseResponse.success(
        todayRecord,
        "Today attendance record retrieved successfully",
        200
      );
    } catch (error) {
      console.error("Error retrieving today attendance record:", error);
      throw error;
    }
  }

  @Get("search")
  async searchAttendance(@Query() searchDto: SearchAttendanceDto): Promise<BaseResponse> {
    try {
      const result = await this.attendanceRecordService.searchAttendance(searchDto);
      return BaseResponse.success(result, "Attendance records retrieved successfully", 200);
    } catch (error) {
      console.error("Error searching attendance records:", error);
      throw error;
    }
  }

  @Get("weekly")
  async getWeeklyAttendance(
    @Req() req: any,
    @Query("weekStart") weekStart?: string
  ): Promise<BaseResponse> {
    try {
      const weekStartDate = weekStart ? new Date(weekStart) : undefined;
      const result = await this.attendanceRecordService.getWeeklyAttendance(
        req?.user?.employeeId,
        weekStartDate
      );
      return BaseResponse.success(result, "Weekly attendance retrieved successfully", 200);
    } catch (error) {
      console.error("Error retrieving weekly attendance:", error);
      throw error;
    }
  }

  @Get("monthly")
  async getMonthlyAttendance(
    @Req() req: any,
    @Query("year") year?: string,
    @Query("month") month?: string
  ): Promise<BaseResponse> {
    try {
      const currentDate = new Date();
      const targetYear = year ? parseInt(year) : currentDate.getFullYear();
      const targetMonth = month ? parseInt(month) : currentDate.getMonth() + 1;

      const result = await this.attendanceRecordService.getMonthlyAttendance(
        req.user.employeeId,
        targetYear,
        targetMonth
      );
      return BaseResponse.success(result, "Monthly attendance retrieved successfully", 200);
    } catch (error) {
      console.error("Error retrieving monthly attendance:", error);
      throw error;
    }
  }

  @Get("employee/:employeeId")
  async getAttendanceByEmployee(
    @Param("employeeId") employeeId: string,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string
  ): Promise<BaseResponse> {
    try {
      const result = await this.attendanceRecordService.getAttendanceByEmployee(
        employeeId,
        startDate,
        endDate
      );
      return BaseResponse.success(result, "Employee attendance retrieved successfully", 200);
    } catch (error) {
      console.error("Error retrieving employee attendance:", error);
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
