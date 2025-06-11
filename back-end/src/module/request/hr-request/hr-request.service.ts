import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Requests, RequestsDocument} from "../../../schemas/requests.schema";
import {Model, Types} from "mongoose";
import {typeRequest, typeRequestDocument} from "../../../schemas/typeRequestCategory.schema";
import {RequestService} from "../request.service";
import {CreateRequestDto} from "../dto/createRequest.dto";

@Injectable()
export class HrRequestService {
    constructor(
        @InjectModel(Requests.name) private readonly requestModel: Model<RequestsDocument>,
        @InjectModel(typeRequest.name) private readonly typeRequestModel: Model<typeRequestDocument>,
        private readonly requestService: RequestService,
    ) {
    }

    async createRequest(req: CreateRequestDto){
        try{
            if(!req.typeCode){
                throw new Error("Type Code is required");
            }
            const typeRequest = await this.typeRequestModel.findOne({code: req.typeCode});
            if(!typeRequest){
                throw new Error("Type Request not found");
            }
            req.typeRequest = new Types.ObjectId(typeRequest?.id);
            req.status = "Pending";

            return await this.requestService.create(req);
        }catch(error){
            throw new Error(error);
        }
    }

    async approveRequest(req: CreateRequestDto){
        try{

        }catch(error){

        }
    }
}
