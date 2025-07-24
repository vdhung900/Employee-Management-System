import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateAttendanceRecordDto } from "./dto/create-attendance.dto";
import { UpdateAttendanceRecordDto } from "./dto/update-attendance.dto";
import { SearchAttendanceDto } from "./dto/search-attendance.dto";
import { InjectModel } from "@nestjs/mongoose";
import { AttendanceRecords, AttendanceRecordsDocument } from "src/schemas/attendanceRecords.schema";
import { Model, Types } from "mongoose";

@Injectable()
export class AttendanceRecordService {
  constructor(
    @InjectModel(AttendanceRecords.name)
    private attendanceRecordModel: Model<AttendanceRecordsDocument>
  ) {}

  //Check-in
  async create(createAttendanceDto: CreateAttendanceRecordDto) {
    const attendanceRecord = new this.attendanceRecordModel({
      ...createAttendanceDto,
      employeeId: new Types.ObjectId(createAttendanceDto.employeeId),
    });
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
      employeeId: new Types.ObjectId(employeeId),
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

  async searchAttendance(searchDto: SearchAttendanceDto) {
    const {
      employeeId,
      startDate,
      endDate,
      sortOrder = "desc",
      sortBy = "date",
      page = 1,
      limit = 10,
      status,
      department,
      isLate,
    } = searchDto;

    // Xây dựng query filter
    const filter: any = {};

    if (employeeId) {
      filter.employeeId = new Types.ObjectId(employeeId);
    }

    // Filter theo khoảng thời gian
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.date.$lte = new Date(endDate);
      }
    }

    if (status) {
      filter.status = status;
    }

    if (isLate !== undefined) {
      filter.isLate = isLate;
    }

    // Tính toán pagination
    const skip = (page - 1) * limit;

    // Xây dựng sort options
    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Execute query với populate employee info
    const [data, total] = await Promise.all([
      this.attendanceRecordModel
        .find(filter)
        .populate({
          path: "employeeId",
          select: "name employeeId department position",
          match: department ? { department } : {},
        })
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.attendanceRecordModel.countDocuments(filter),
    ]);

    // Filter out records where populate returned null (due to department filter)
    const filteredData = data.filter((record) => record.employeeId);

    return {
      data: filteredData,
      pagination: {
        current: page,
        pageSize: limit,
        total: total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getAttendanceByEmployee(employeeId: string, startDate?: string, endDate?: string) {
    const filter: any = { employeeId: new Types.ObjectId(employeeId) };

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.date.$lte = new Date(endDate);
      }
    }

    return await this.attendanceRecordModel
      .find(filter)
      .populate("employeeId", "name employeeId department position")
      .sort({ date: 1 })
      .exec();
  }

  async getWeeklyAttendance(employeeId: string, weekDate?: Date) {
    const startOfWeek = weekDate || new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Chủ nhật
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Thứ 7
    endOfWeek.setHours(23, 59, 59, 999);

    return await this.attendanceRecordModel
      .find({
        employeeId: new Types.ObjectId(employeeId),
        date: {
          $gte: startOfWeek,
          $lte: endOfWeek,
        },
      })
      .sort({ date: 1 })
      .exec();
  }

  async getMonthlyAttendance(employeeId: string, year: number, month: number) {
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

    return await this.attendanceRecordModel
      .find({
        employeeId: new Types.ObjectId(employeeId),
        date: {
          $gte: startOfMonth,
          $lte: endOfMonth,
        },
      })
      .sort({ date: 1 })
      .exec();
  }

  remove(id: number) {
    return `This action removes a #${id} attendance`;
  }
}
