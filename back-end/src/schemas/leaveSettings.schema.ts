import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseSchema } from "./base.schema";
import { Types } from "mongoose";
import { Employees } from "./employees.schema";

export type LeaveSettingDocument = LeaveSettings & Document;

@Schema()
export class LeaveSettings extends BaseSchema {
    @Prop()
    code: string;

    @Prop()
    name: string;

    @Prop()
    description: string;

    @Prop()
    maxDaysPerYear: number;

    @Prop({default: true})
    isPaid: Boolean;

    @Prop()
    isActive: Boolean;

    @Prop()
    note: string;
}

export const LeaveSettingSchema = SchemaFactory.createForClass(LeaveSettings);