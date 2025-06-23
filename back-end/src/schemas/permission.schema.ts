import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseSchema } from "./base.schema";
import { Document, Types } from "mongoose";

export type PermissionDocument = Permission & Document;

@Schema()
export class Permission extends BaseSchema {
    @Prop({ required: true })
    name: string;

    @Prop()
    path: string;

    @Prop()
    description: string;

    @Prop()
    code: string;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
