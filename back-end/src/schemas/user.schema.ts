import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { BaseSchema } from "./base.schema";
import { Employees } from "./employees.schema";

export type UserDocument = User & Document;

@Schema()
export class User extends BaseSchema {
    @Prop({ unique: true, required: true})
    username: string;

    @Prop({ required: true})
    password: string;

    @Prop({ required: true, default: 'employee'})
    role: string;

    @Prop({ default: '00'})
    status: string;

    @Prop({ type: Types.ObjectId, ref: Employees.name})
    employeeId: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);