import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Requests, RequestsDocument} from "../../../schemas/requests.schema";
import {Model, Types} from "mongoose";
import {typeRequest, typeRequestDocument} from "../../../schemas/typeRequestCategory.schema";
import {RequestService} from "../request.service";
import {CreateRequestDto} from "../dto/createRequest.dto";
import {Departments, DepartmentsDocument} from "../../../schemas/departments.schema";
import {Position, PositionDocument} from "../../../schemas/position.schema";

@Injectable()
export class HrRequestService {
    constructor(
        @InjectModel(Requests.name) private readonly requestModel: Model<RequestsDocument>,
        @InjectModel(typeRequest.name) private readonly typeRequestModel: Model<typeRequestDocument>,
        @InjectModel(Departments.name) private departmentModel: Model<DepartmentsDocument>,
        @InjectModel(Position.name) private positionModel: Model<PositionDocument>,
        private readonly requestService: RequestService,
    ) {
    }

    async getRequestByCode(code: string){
        try{
            const typeRequest = await this.typeRequestModel.findOne({code: code});
            if(!typeRequest){
                throw new Error("Type Request not found");
            }
            const data = await this.requestService.findByTypeCode(new Types.ObjectId(typeRequest.id));
            if (!data || data.length === 0) {
                throw new Error("No requests found for this type");
            }
            let response = {};
            if (code === 'ACCOUNT_CREATE_REQUEST') {
                response = await Promise.all(
                    data
                        .filter(item => item.status !== 'Canceled')
                        .map(async (item) => {
                        const department = await this.departmentModel.findById(new Types.ObjectId(item.dataReq.department)).exec();
                        const position = await this.positionModel.findById(new Types.ObjectId(item.dataReq.position)).exec();
                        return {
                            ...item.toObject(),
                            dataReq: {
                                ...item.dataReq,
                                departmentName: department?.name,
                                positionName: position?.name,
                            }
                        };
                    })
                );
            }
            return response;
        }catch (e) {
            throw new Error(e);
        }
    }

    async getRequestByAccountId(req: CreateRequestDto){
        try{
            const requests = await this.requestService.findByEmployeeId(req.employeeId.toString());
            if(!requests || requests.length === 0){
                throw new Error("No requests found for this employee");
            }
            return requests;
        }catch (e) {
            throw new Error(e)
        }
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

    async updateRequest(req: CreateRequestDto){
        try{
            return await this.requestService.update(req.requestId, req);
        }catch(error){
            throw new Error(error);
        }
    }

    async approveRequest(req: CreateRequestDto){
        try{
            return await this.requestService.approve(req.requestId, req.status);
        }catch(error){
            throw new Error(error);
        }
    }
}
