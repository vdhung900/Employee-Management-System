// leave-balance.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {Employees} from "./employees.schema";

export type LeaveBalanceDocument = LeaveBalance & Document;

@Schema()
export class LeaveBalance {
    @Prop({ type: Types.ObjectId, ref: Employees.name, required: true })
    employeeId: Types.ObjectId;

    @Prop({ type: String, required: true })
    leaveTypeCode: string;

    @Prop({ type: Number, required: true, default: 0 })
    totalAllocated: number;

    @Prop({ type: Number, default: 0 })
    used: number;

    @Prop({ type: Number, default: 0 })
    remaining: number;

    @Prop()
    note?: string;
}

export const LeaveBalanceSchema = SchemaFactory.createForClass(LeaveBalance);
