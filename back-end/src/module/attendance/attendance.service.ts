import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateAttendanceRecordDto } from "./dto/create-attendance.dto";
import { UpdateAttendanceRecordDto } from "./dto/update-attendance.dto";
import { InjectModel } from "@nestjs/mongoose";
import { AttendanceRecords, AttendanceRecordsDocument } from "src/schemas/attendanceRecords.schema";
import { Model } from "mongoose";

@Injectable()
export class AttendanceRecordService {
  constructor(
    @InjectModel(AttendanceRecords.name)
    private attendanceRecordModel: Model<AttendanceRecordsDocument>
  ) {}

  //Check-in
  async create(createAttendanceDto: CreateAttendanceRecordDto) {
    const attendanceRecord = new this.attendanceRecordModel(createAttendanceDto);
    return attendanceRecord.save();
  }

  async findAll() {
    const attendanceRecords = await this.attendanceRecordModel.find().populate("employeeId").exec();
    if (!attendanceRecords || attendanceRecords.length === 0) {
      throw new NotFoundException("No attendance records found");
    }
    return attendanceRecords;
  }

  async findById(id: number) {
    return await this.attendanceRecordModel.findById(id);
  }

  async findByEmployeeIdToday(employeeId: string) {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    return await this.attendanceRecordModel.findOne({
      employeeId: employeeId,
      date: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });
  }

  async findOne(filter: any) {
    return await this.attendanceRecordModel.findOne(filter);
  }

  async update(id: number, updateAttendanceDto: UpdateAttendanceRecordDto) {
    console.log("Update Attendance Record:", id, updateAttendanceDto);

    const attendanceRecord = await this.attendanceRecordModel.findByIdAndUpdate(
      id,
      updateAttendanceDto,
      {
        new: true,
      }
    );
    if (!attendanceRecord) {
      throw new NotFoundException(`Attendance record #${id} not found`);
    }
    return attendanceRecord;
  }

  remove(id: number) {
    return `This action removes a #${id} attendance`;
  }
}
