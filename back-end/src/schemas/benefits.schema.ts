import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseSchema } from "./base.schema";
import { Document, Types } from "mongoose";
import { Departments } from "./departments.schema";
import { Employees } from "./employees.schema";
import { Account } from "./account.schema";

export type BenefitDocument = Benefits & Document;

@Schema()
export class Benefits extends BaseSchema {
    @Prop()
    name: string;

    @Prop()
    description: string;

    @Prop()
    amount: number; // VND

    @Prop({ type: [{ type: Types.ObjectId, ref: Employees.name }] })
    employees: Types.ObjectId[];

    @Prop({ type: [{ type: Types.ObjectId, ref: Departments.name }] })
    departments: Types.ObjectId[];

    @Prop({ enum: ['auto', 'manual'], default: 'auto' })
    status: string;

    @Prop({ type: [Number] })
    effective: number[]; // tháng trong năm (1-12)

    @Prop({ default: false })
    applyAll?: boolean;
}

export const BenefitSchema = SchemaFactory.createForClass(Benefits);