import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseSchema } from "./base.schema";
import { Document, Types } from "mongoose";
import { Type } from "class-transformer";
import { Employees } from "./employees.schema";

export type SalaryRankDocument = SalaryRank & Document;

@Schema()
export class SalaryRank extends BaseSchema {
    
    @Prop()
    name: string;

    @Prop()
    salary_base: number;

    @Prop()
    code: string;

    @Prop()
    effective_from: Date;

    @Prop() 
    effective_to: Date;
}

export const SalaryRankSchema = SchemaFactory.createForClass(SalaryRank);