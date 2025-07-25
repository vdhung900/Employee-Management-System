import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseSchema } from "./base.schema";
import { Document, Types } from "mongoose";

export type ContractDocument = Contract & Document;

@Schema()
export class Contract extends BaseSchema {
   
    @Prop({ required: true })
    contract_type: string;

    @Prop({ required: true })
    start_date: Date;

    @Prop({ required: true })
    end_date: Date;

    @Prop({ required: true })
    status: string;

    @Prop()
    file_url: string;
}

export const ContractSchema = SchemaFactory.createForClass(Contract);
