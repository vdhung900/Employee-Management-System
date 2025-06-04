import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseSchema } from "./base.schema";
import { Document, Types } from "mongoose";

export type EmployeesDocument = Employees & Document;

@Schema()
export class Employees extends BaseSchema{
    @Prop()
    fullName: string;

    @Prop()
    dob: Date;

    @Prop()
    gender: string;

    @Prop()
    phone: string;

    @Prop()
    email: string;

    @Prop({type: Types.ObjectId, ref: 'Department'})
    departmentId: Types.ObjectId;

    @Prop({type: Types.ObjectId, ref: 'Position'})
    positionId: Types.ObjectId;

    @Prop()
    joinDate: Date;

    @Prop()
    resignDate: Date;

    @Prop()
    status: string;

    @Prop()
    bankAccount: string;

    @Prop()
    bankName: string;

    @Prop()
    document: string;

    @Prop({type: Types.ObjectId, ref: 'Contract'})
    contractId: Types.ObjectId;
}

export const EmployeesSchema = SchemaFactory.createForClass(Employees);