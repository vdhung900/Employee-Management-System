// back-end/src/schemas/notification.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Document, Types} from 'mongoose';
import { BaseSchema } from './base.schema';
import {Employees} from "./employees.schema";

export type NotificationDocument = Notification & Document;

@Schema()
export class Notification extends BaseSchema {
  @Prop({ type: Types.ObjectId, ref: Employees.name })
  employeeId: Types.ObjectId;

  @Prop({ required: true })
  message: string;

  @Prop({ default: false })
  read: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);