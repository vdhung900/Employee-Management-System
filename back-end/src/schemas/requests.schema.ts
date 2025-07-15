import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import { BaseSchema } from "./base.schema";
import { Schema as MongooseSchema, Document, Types} from "mongoose";
import { Employees } from "./employees.schema";
import {typeRequest} from "./typeRequestCategory.schema";
import {Documents} from "./documents.schema";
import {Departments} from "./departments.schema";

export type RequestsDocument = Requests & Document;

@Schema()
export class Requests extends BaseSchema {
    @Prop({type: Types.ObjectId, ref: Employees.name})
    employeeId: Types.ObjectId;

    @Prop({type: Types.ObjectId, ref: Departments.name})
    departmentId: Types.ObjectId;

    @Prop({type: Types.ObjectId, ref: typeRequest.name})
    typeRequest: Types.ObjectId;

    @Prop({ type: Object })
    dataReq: Record<string, any>;

    @Prop()
    priority: string;

    @Prop()
    reason: string;

    @Prop()
    status: string;

    @Prop({default: 0})
    timeResolve: number;

    @Prop()
    note: string;

    @Prop({ type: [{ type: Types.ObjectId, ref: Documents.name }] })
    attachments: Types.ObjectId[];

    @Prop({type: Types.ObjectId, ref: Employees.name})
    approverId: Types.ObjectId;
}

export const RequestsSchema = SchemaFactory.createForClass(Requests);