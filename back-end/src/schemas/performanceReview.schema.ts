import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {Employees} from "./employees.schema";
import {MonthlyGoal} from "./monthGoals.schema";

export type MonthlyReviewDocument = MonthlyReview & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: false } })
export class MonthlyReview {
    @Prop({ type: Types.ObjectId, ref: Employees.name, required: true })
    employee_id: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: MonthlyGoal.name, required: true })
    goal_ref: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: Employees.name, required: true })
    reviewer_id: Types.ObjectId;

    @Prop({ required: true })
    month: number;

    @Prop({ required: true })
    year: number;

    @Prop({
        type: [
            {
                goalTitle: { type: String, required: true },
                targetValue: { type: Number, required: true },
                actualValue: { type: Number, required: true },
                score: { type: Number, required: true },
            },
        ],
        required: true,
    })
    results: {
        goalTitle: string;
        targetValue: number;
        actualValue: number;
        score: number;
    }[];

    @Prop({ required: true })
    overallScore: number;

    @Prop({ required: true })
    comment: string;

    @Prop()
    bonus?: number;
}

export const MonthlyReviewSchema = SchemaFactory.createForClass(MonthlyReview);
