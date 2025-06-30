import { PartialType } from '@nestjs/swagger';
import { CreateAttendanceRecordDto } from "./create-attendance.dto";

export class UpdateAttendanceRecordDto extends PartialType(CreateAttendanceRecordDto) {}
