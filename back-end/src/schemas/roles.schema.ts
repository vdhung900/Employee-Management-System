import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseSchema } from "./base.schema";
import { Document, Types } from "mongoose";
import {STATUS} from "../enum/status.enum";

export type RoleDocument = Roles & Document;

@Schema()
export class Roles extends BaseSchema {
    @Prop({ required: true })
    name: string;

    @Prop()
    code: string;

    @Prop()
    description: string;

    @Prop({default: STATUS.ACTIVE})
    status: string;
}

export const RoleSchema = SchemaFactory.createForClass(Roles);
