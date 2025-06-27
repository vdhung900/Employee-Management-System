import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseSchema } from "./base.schema";
import { Document, Types } from "mongoose";
import { SalaryRank } from "./salaryRank.schema";

export type SalaryCoefficientDocument = SalaryCoefficient & Document;

@Schema()
export class SalaryCoefficient extends BaseSchema {
    @Prop({type: Types.ObjectId, ref: SalaryRank.name})
    salary_rankId: Types.ObjectId;

    @Prop()
    salary_coefficient: number;

}

export const SalaryCoefficientSchema = SchemaFactory.createForClass(SalaryCoefficient);