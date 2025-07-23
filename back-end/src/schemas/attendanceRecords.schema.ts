import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseSchema } from "./base.schema";
import { Types } from "mongoose";
import { Employees } from "./employees.schema";
import { typeRequest } from "./typeRequestCategory.schema";

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
    enum: ["Chưa checkout", "Vắng mặt", "Đi muộn", "Về sớm", "Đúng giờ"],
    default: "Vắng mặt",
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
