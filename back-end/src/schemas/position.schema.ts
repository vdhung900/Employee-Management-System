import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseSchema } from "./base.schema";
import { Document, Types } from "mongoose";

export type PositionDocument = Position & Document;

@Schema()
export class Position extends BaseSchema {
    @Prop({ required: true })
    name: string;

    @Prop()
    job_title: string;

    @Prop()
    job_rank: number;

    @Prop()
    description: string;

    @Prop()
    code: string;

    @Prop()
    level: number;
}

export const PositionSchema = SchemaFactory.createForClass(Position);
