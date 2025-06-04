import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseSchema } from "./base.schema";
import { Types } from "mongoose";
import { Employees } from "./employees.schema";

export type AttendanceRecordsDocument = AttendanceRecords & Document;

@Schema()
export class AttendanceRecords extends BaseSchema {
    @Prop({type: Types.ObjectId, ref: Employees.name})
    employeeId: Types.ObjectId;

    @Prop()
    date: Date;

    @Prop()
    firstCheckIn: Date;

    @Prop()
    lastCheckIn: Date;

    @Prop()
    totalWorkingHours: number;

    @Prop()
    leaveType: string;

    @Prop()
    status: string;

    @Prop()
    note: string;
}

export const AttendanceRecordSchema = SchemaFactory.createForClass(AttendanceRecords);