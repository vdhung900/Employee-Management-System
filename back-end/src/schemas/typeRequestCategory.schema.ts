import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import { BaseSchema } from "./base.schema";
import {Document, Types} from "mongoose";
import { Employees } from "./employees.schema";

export type typeRequestDocument = typeRequest & Document;

@Schema()
export class typeRequest extends BaseSchema {
    @Prop()
    name: string;

    @Prop()
    description: string;

    @Prop()
    code: string;

    @Prop()
    isActive: Boolean;

    @Prop()
    role: string;
}

export const typeRequestSchema = SchemaFactory.createForClass(typeRequest);