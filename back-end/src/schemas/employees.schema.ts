import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseSchema } from "./base.schema";
import { Document, Types } from "mongoose";
import {  Departments } from "./departments.schema";
import { Position } from "./position.schema";
import { SalaryCoefficient } from "./salaryCoefficents.schema";
import { Contract } from "./contracts.schema";
import {Documents} from "./documents.schema";

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

    @Prop({type: Types.ObjectId, ref: Departments.name})
    departmentId: Types.ObjectId;

    @Prop({type: Types.ObjectId, ref: Position.name})
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

    @Prop({default: null})
    timeUpdateSalary: Date;

    @Prop({ type: [{ type: Types.ObjectId, ref: Documents.name }] })
    attachments: Types.ObjectId[];

    @Prop({type: Types.ObjectId, ref: Contract.name})
    contractId: Types.ObjectId;

    @Prop({type: Types.ObjectId, ref: SalaryCoefficient.name})
    salaryCoefficientId: Types.ObjectId;

    @Prop()
    address: string;

    @Prop()
    avatar: string;

    @Prop()
    code: string;

    @Prop()
    childDependents: Number;

}

export const EmployeesSchema = SchemaFactory.createForClass(Employees);