import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseSchema } from "./base.schema";
import { Document, Types } from "mongoose";
import {  Departments } from "./departments.schema";
import { Position } from "./position.schema";
import { SalaryCoefficient } from "./salaryCoefficents.schema";
import { Contract } from "./contracts.schema";

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

    @Prop()
    document: string;

    @Prop({type: Types.ObjectId, ref: Contract.name})
    contractId: Types.ObjectId;

    @Prop({type: Types.ObjectId, ref: SalaryCoefficient.name})
    salaryCoefficientId: Types.ObjectId;

   

}

export const EmployeesSchema = SchemaFactory.createForClass(Employees);