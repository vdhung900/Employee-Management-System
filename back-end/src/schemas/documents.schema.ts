import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseSchema } from "./base.schema";
import { Document, Types } from "mongoose";

export type DocumentsDocument = Documents & Document;

@Schema()
export class Documents extends BaseSchema{
    @Prop()
    originalName: string;

    @Prop()
    mimeType: string;

    @Prop()
    url: string;

    @Prop()
    key: string;
}

export const DocumentsSchema = SchemaFactory.createForClass(Documents);