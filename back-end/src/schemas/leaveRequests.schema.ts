import { Prop, Schema } from "@nestjs/mongoose";
import { BaseSchema } from "./base.schema";
import { Types } from "mongoose";
import { Employees } from "./employees.schema";

@Schema()
export class leaveRequest extends BaseSchema {
    @Prop({type: Types.ObjectId, ref: Employees.name})
    employeeId: Types.ObjectId;

    @Prop()
    leaveType: string;

    @Prop()
    startDate: Date;

    @Prop()
    endDate: Date;

    @Prop()
    reason: String;

    @Prop()
    status: String;

    @Prop({type: Types.ObjectId, ref: Employees.name})
    approverId: Types.ObjectId;
}