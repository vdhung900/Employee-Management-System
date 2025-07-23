import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {BaseSchema} from "./base.schema";
import {Employees} from "./employees.schema";

export type SalarySlipDocument = SalarySlip & Document;

@Schema({ timestamps: true })
export class SalarySlip extends BaseSchema {
  @Prop({ type: Types.ObjectId, ref: Employees.name, required: true })
  employeeId: Types.ObjectId;

  @Prop({ required: true })
  month: number;

  @Prop({ required: true })
  year: number;

  @Prop() 
  baseSalary: number;

  @Prop() 
  salaryCoefficient: number;

  @Prop() 
  totalBaseSalary: number;

  @Prop()
  unpaidLeave: number;

  @Prop()
  cntLatePenalty: number;

  @Prop()
  latePenalty: number;

  @Prop()
  otWeekdayHour: number;

  @Prop()
  otWeekendHour: number;

  @Prop()
  otWeekday: number;

  @Prop()
  otWeekend: number;

  @Prop()
  otHoliday: number;

  @Prop()
  totalOtHour: number;

  @Prop()
  personalIncomeTax: number;

  @Prop()
  numDependents: number;

  @Prop()
  familyDeduction: number;

  @Prop()
  netSalary: number;

  @Prop({ default: '00' })
  status: string;

  @Prop()
  totalOtSalary: number;

  @Prop()
  totalTaxableIncome: number;

  @Prop({ default: 0 })
  benefit: number;

  @Prop()
  stt: number
  
  @Prop()
  socialInsurance: number;

  @Prop()
  healthInsurance: number;

  @Prop()
  unemploymentInsurance: number;

  @Prop()
  totalInsurance: number;

  @Prop()
  unpaidLeaveCount: number;

}

export const SalarySlipSchema = SchemaFactory.createForClass(SalarySlip);