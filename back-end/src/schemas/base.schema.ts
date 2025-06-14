import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema()
export class BaseSchema extends Document {
  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ type: Types.ObjectId, ref: "Account" })
  createdByUserId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Account" })
  updatedByUserId: Types.ObjectId;
}

export const BaseSchemaSchema = SchemaFactory.createForClass(BaseSchema);
