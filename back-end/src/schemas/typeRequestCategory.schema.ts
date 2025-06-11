import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import { BaseSchema } from "./base.schema";
import {Document, Types} from "mongoose";
import { Employees } from "./employees.schema";

export type typeRequestDocument = typeRequest & Document;

@Schema()
export class typeRequest extends BaseSchema {
    @Prop()
    name: String;

    @Prop()
    description: String;

    @Prop()
    code: String;

    @Prop()
    isActive: Boolean;

    @Prop()
    role: String;

}

export const typeRequestSchema = SchemaFactory.createForClass(typeRequest);