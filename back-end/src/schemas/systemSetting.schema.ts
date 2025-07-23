import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseSchema } from "./base.schema";
import { Types } from "mongoose";
import { Employees } from "./employees.schema";

export type SystemSettingDocument = SystemSetting & Document;

@Schema()
export class SystemSetting extends BaseSchema {
    @Prop()
    key: string;

    @Prop({ type: Object })
    value: Record<string, any>;

    @Prop()
    type: string;
}

export const SystemSettingSchema = SchemaFactory.createForClass(SystemSetting);