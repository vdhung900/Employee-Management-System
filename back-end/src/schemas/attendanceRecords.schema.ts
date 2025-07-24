import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseSchema } from "./base.schema";
import { Types } from "mongoose";
import { Employees } from "./employees.schema";
import { typeRequest } from "./typeRequestCategory.schema";
import { STATUS } from "src/enum/status.enum";

export type AttendanceRecordsDocument = AttendanceRecords & Document;

@Schema()
export class AttendanceRecords extends BaseSchema {
  @Prop({ type: Types.ObjectId, ref: Employees.name })
  employeeId: Types.ObjectId;

  @Prop()
  date: Date;

  @Prop()
  firstCheckIn: Date;

  @Prop()
  lastCheckOut: Date;

  @Prop()
  isLate: boolean;

  @Prop()
  totalWorkingHours: number;

  @Prop({
    enum: [
      STATUS.PRESENT,
      STATUS.LEAVE,
      STATUS.NGHI_THAI_SAN,
      STATUS.NGHI_KHONG_LUONG,
      STATUS.NGHI_VO_SINH,
      STATUS.NGHI_CUOI,
      STATUS.NGHI_LAM_TU_XA,
      STATUS.NGHI_OM,
      STATUS.LATE,
      STATUS.VE_SOM,
      STATUS.OVERTIME,
    ],
    default: STATUS.LEAVE,
  })
  status: string;

  //Đi muộn hoặc về sớm: 8h30 - 17h30
  @Prop()
  isPenalty: boolean;

  @Prop()
  note: string;

  @Prop({ default: false })
  isOvertime: Boolean;

  @Prop()
  overtimeRange: string[];

  @Prop({ default: false })
  isLeave: Boolean;

  @Prop({ default: false })
  isEarlyTime: Boolean;

  @Prop({ default: true })
  isPaid: Boolean;

  @Prop()
  reason: string;
}

export const AttendanceRecordSchema = SchemaFactory.createForClass(AttendanceRecords);
