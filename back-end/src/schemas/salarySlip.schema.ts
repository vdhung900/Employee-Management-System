import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseSchema } from "./base.schema";
import { Document, Types } from "mongoose";
import { SalaryPackage } from "./salaryPackage.schema";
import { Employees } from "./employees.schema";

export type SalarySlipDocument = SalarySlip & Document;

@Schema()
export class SalarySlip extends BaseSchema {
    @Prop({type: Types.ObjectId, ref: Employees.name})
    employeeId: Types.ObjectId;

    @Prop({type: Types.ObjectId, ref: SalaryPackage.name})
    salaryPackageId: Types.ObjectId;

    @Prop()
    month: Date;

    @Prop()
    year: Date;

    @Prop()
    baseSalary: number;

    @Prop()
    allowances: number;

    @Prop()
    insurance: number;

    @Prop()
    tax: number;

    @Prop()
    leaveDeduction: number;

    @Prop()
    benefitTotal: number;

    @Prop()
    performanceBonus: number;

    @Prop()
    otherBonus: number;

    @Prop()
    totalSalary: number;

    @Prop()
    pdfUrl: string;
}

export const SalarySlipSchema = SchemaFactory.createForClass(SalarySlip);