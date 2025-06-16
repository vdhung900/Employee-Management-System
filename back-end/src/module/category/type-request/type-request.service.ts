import { Injectable } from '@nestjs/common';
import {Model} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";
import {typeRequest, typeRequestDocument} from "../../../schemas/typeRequestCategory.schema";

@Injectable()
export class TypeRequestService {
    constructor(
        @InjectModel(typeRequest.name) private readonly typeRequestModel: Model<typeRequestDocument>
    ) {
    }

    async getTypeReqByRole(role: string){
        try{
            if(role !== 'hr' && role !== 'staff' && role !== 'manager' && role !== 'admin'){
                throw new Error("Invalid role");
            }
            const data = await this.typeRequestModel.find({role: role}).exec();
            if(!data || data.length === 0){
                throw new Error("No type requests found for this role");
            }
            return data;
        }catch (e) {
            throw new Error(e);
        }
    }
}
