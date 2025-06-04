import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseSchema } from "./base.schema";
import { Document, Types } from "mongoose";
import { Departments } from "./departments.schema";
import { Employees } from "./employees.schema";

export type BenefitDocument = Benefits & Document;

@Schema()
export class Benefits extends BaseSchema {
    @Prop()
    name: string;

    @Prop()
    description: string;

    @Prop()
    amount: number;

    @Prop()
    amountType: string;

    @Prop({type: Types.ObjectId, ref: Departments.name})
    departmentId: Types.ObjectId;

    @Prop({type: Types.ObjectId, ref: Employees.name})
    employeeId: Types.ObjectId;

    @Prop()
    effectiveFrom: Date;

    @Prop()
    effectiveTo: Date;
}

export const BenefitSchema = SchemaFactory.createForClass(Benefits);