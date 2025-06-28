import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {STATUS} from "../enum/status.enum";
import {Employees} from "./employees.schema";
import {BaseSchema} from "./base.schema";

export type MonthlyGoalDocument = MonthlyGoal & Document;

@Schema()
export class MonthlyGoal extends BaseSchema {
    @Prop({ type: Types.ObjectId, ref: Employees.name, required: true })
    employee_id: Types.ObjectId;

    @Prop({ required: true })
    month: number;

    @Prop({ required: true })
    year: number;

    @Prop({
        type: [
            {
                title: { type: String, required: true },
                targetValue: { type: Number, required: true },
            },
        ],
        required: true,
    })
    goals: { title: string; targetValue: number }[];

    @Prop({ default: STATUS.PENDING })
    status: STATUS.PENDING | STATUS.APPROVED | STATUS.REJECTED;
}

export const MonthlyGoalSchema = SchemaFactory.createForClass(MonthlyGoal);
