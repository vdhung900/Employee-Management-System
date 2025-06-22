import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseSchema } from "./base.schema";
import { Document, Types } from "mongoose";
import { Roles } from "./roles.schema";
import { Permission } from "./permission.schema";

export type RolePermissionDocument = RolePermission & Document;

@Schema()
export class RolePermission extends BaseSchema {
  @Prop({ type: Types.ObjectId, ref: Roles.name, required: true })
  role: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: Permission.name }], required: true })
  permissions: Types.ObjectId[];
}

export const RolePermissionSchema = SchemaFactory.createForClass(RolePermission);
