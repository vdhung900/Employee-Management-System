import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import { BaseSchema } from "./base.schema";
import { Schema as MongooseSchema, Document, Types} from "mongoose";
import { Employees } from "./employees.schema";
import {typeRequest} from "./typeRequestCategory.schema";

export type RequestsDocument = Requests & Document;

@Schema()
export class Requests extends BaseSchema {
    @Prop({type: Types.ObjectId, ref: Employees.name})
    employeeId: Types.ObjectId;

    @Prop({type: Types.ObjectId, ref: typeRequest.name})
    typeRequest: Types.ObjectId;

    @Prop({ type: Object })
    dataReq: Record<string, any>;

    @Prop()
    startDate: Date;

    @Prop()
    endDate: Date;

    @Prop()
    reason: String;

    @Prop()
    status: String;

    @Prop({default: 0})
    timeResolve: number;

    @Prop({type: Types.ObjectId, ref: Employees.name})
    approverId: Types.ObjectId;
}

export const RequestsSchema = SchemaFactory.createForClass(Requests);