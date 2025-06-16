import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseSchema } from "./base.schema";
import { Document, Types } from "mongoose";
import { Employees } from "./employees.schema";

export type DepartmentsDocument = Departments & Document;

@Schema()
export class Departments extends BaseSchema {
    @Prop()
    name: string;

    @Prop()
    description: string;

    @Prop({type: Types.ObjectId, ref: Employees.name})
    managerId: Types.ObjectId;
}

export const DepartmentsSchema = SchemaFactory.createForClass(Departments);