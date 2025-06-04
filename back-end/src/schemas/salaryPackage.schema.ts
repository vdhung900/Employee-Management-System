import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseSchema } from "./base.schema";
import { Document, Types } from "mongoose";
import { Type } from "class-transformer";
import { Employees } from "./employees.schema";

export type SalaryPackageDocument = SalaryPackage & Document;

@Schema()
export class SalaryPackage extends BaseSchema {
    @Prop({type: Types.ObjectId, ref: Employees.name})
    employeeId: Types.ObjectId;

    @Prop()
    packageName: string;

    @Prop()
    basicSalary: number;

    @Prop()
    allowance: number;

    @Prop()
    insurance: number;

    @Prop()
    tax: number;

    @Prop()
    effectiveFrom: Date;

    @Prop()
    effectiveTo: Date;
}

export const SalaryPackageSchema = SchemaFactory.createForClass(SalaryPackage);