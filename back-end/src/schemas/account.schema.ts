import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { BaseSchema } from "./base.schema";
import { Employees } from "./employees.schema";
import {Roles} from "./roles.schema";

export type AccountDocument = Account & Document;

@Schema()
export class Account extends BaseSchema {
  @Prop({ unique: true, required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: Types.ObjectId, ref: Roles.name })
  role: Types.ObjectId;

  @Prop({ default: "00" })
  status: string;

  @Prop({ type: Types.ObjectId, ref: Employees.name })
  employeeId: Types.ObjectId;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
