import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseSchema } from "./base.schema";
import { Document, Types } from "mongoose";
import { Employees } from "./employees.schema";

export type TimePunchDocument = TimePunch & Document;

@Schema()
export class TimePunch extends BaseSchema {
    @Prop({type: Types.ObjectId, ref: Employees.name})
    employeeId: Types.ObjectId;

    @Prop()
    punchTime: Date;

    @Prop()
    punchType: string;

    @Prop()
    ipAddress: string;
}

export const TimePunchSchema = SchemaFactory.createForClass(TimePunch);