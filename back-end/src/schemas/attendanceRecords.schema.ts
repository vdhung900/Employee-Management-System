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

  @Prop({ type: Types.ObjectId, ref: typeRequest.name })
  leaveType: Types.ObjectId;

  @Prop()
  status: string;

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

  @Prop()
  reason: string;
}

export const AttendanceRecordSchema = SchemaFactory.createForClass(AttendanceRecords);
