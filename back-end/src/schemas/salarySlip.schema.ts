import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class SalarySlip extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Employee', required: true })
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
  latePenalty: number;

  @Prop()
  otWeekday: number;

  @Prop()
  otWeekend: number;

  @Prop()
  otHoliday: number;

  @Prop()
  insurance: number;

  @Prop()
  personalIncomeTax: number;

  @Prop()
  familyDeduction: number;

  @Prop()
  totalSalary: number;
  
}

export const SalarySlipSchema = SchemaFactory.createForClass(SalarySlip);