import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BaseSchema } from './base.schema';

export type RequestLogDocument = RequestLog & Document;

@Schema({
  timestamps: true,
})
export class RequestLog extends BaseSchema {
  @Prop({ required: true })
  method: string;

  @Prop({ required: true })
  url: string;

  @Prop()
  statusCode: number;

  @Prop()
  ipAddress: string;

  @Prop({ type: Types.ObjectId, ref: 'User' }) 
  userId: Types.ObjectId;

  @Prop({ type: Object })
  body: Record<string, any>;

  @Prop({ type: Object })
  query: Record<string, any>;

  @Prop({ type: Object })
  headers: Record<string, any>;

  @Prop()
  responseTime: number;
}

export const RequestLogSchema = SchemaFactory.createForClass(RequestLog);