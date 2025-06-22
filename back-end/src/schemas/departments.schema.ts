import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseSchema } from "./base.schema";
import { Document, Types } from "mongoose";
import { Account } from "./account.schema";
import mongoose from "mongoose";

export type DepartmentsDocument = Departments & Document;

@Schema()
export class Departments extends BaseSchema {
    @Prop()
    name: string;

    @Prop()
    description: string;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: Account.name,
        required: false,
    })
    managerId: Types.ObjectId;
}

export const DepartmentsSchema = SchemaFactory.createForClass(Departments);