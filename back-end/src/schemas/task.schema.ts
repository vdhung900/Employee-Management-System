import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseSchema } from "./base.schema";
import { Types } from "mongoose";
import { Employees } from "./employees.schema";

export type TasksDocument = Tasks & Document;

@Schema()
export class Tasks extends BaseSchema {
    @Prop({type: Types.ObjectId, ref: Employees.name})
    employeeId: Types.ObjectId;

    @Prop()
    month: Date;

    @Prop()
    year: Date;

    @Prop()
    type: string;

    @Prop()
    title: string;

    @Prop()
    description: string;

    @Prop()
    status: string;

    @Prop({type: Types.ObjectId, ref: Employees.name})
    managerId: Types.ObjectId;

    @Prop()
    approvedAt: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Tasks);