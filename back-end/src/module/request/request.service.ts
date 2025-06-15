import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Requests, RequestsDocument} from "../../schemas/requests.schema";
import {Model} from "mongoose";
import {typeRequest, typeRequestDocument} from "../../schemas/typeRequestCategory.schema";
import {CreateRequestDto} from "./dto/createRequest.dto";

@Injectable()
export class RequestService {
    constructor(
        @InjectModel(Requests.name) private readonly requestModel: Model<RequestsDocument>,
        @InjectModel(typeRequest.name) private readonly typeRequestModel: Model<typeRequestDocument>,
    ) {
    }

    async create(requestData: CreateRequestDto) {
        const newRequest = new this.requestModel(requestData);
        await newRequest.save()
        return this.findById(newRequest._id);
    }

    async findAll() {
        return await this.requestModel.find().populate('employeeId').populate('typeRequest').exec();
    }

    async findById(id: any) {
        return await this.requestModel.findById(id).populate('employeeId').populate('typeRequest').exec();
    }

    async findByEmployeeId(employeeId: string) {
        return await this.requestModel.find({employeeId: employeeId}).populate('employeeId').populate('typeRequest').exec();
    }

    async update(id: string, updateData: CreateRequestDto) {
        const data = await this.requestModel.findById(id).populate('employeeId').populate('typeRequest').exec();
        if (!data) {
            throw new Error('Request not found');
        }
        Object.assign(data, updateData);
        return await data.save();
    }

    async delete(id: string) {
        const data = await this.requestModel.findByIdAndDelete(id).exec();
        if (!data) {
            throw new Error('Request not found');
        }
        return data;
    }

    async approve(id: string, status: string){
        const data = await this.findById(id);
        if(!data){
            throw new Error('Request not found');
        }

        if(status === 'approved'){
            if(data.status !== 'pending'){
                throw new Error('Request is not pending');
            }
            data.status = 'approved';
            data.timeResolve = 1;
            await data.save();
            return data;
        }else if(status === 'rejected'){
            if(data.status !== 'pending'){
                throw new Error('Request is not pending');
            }
            data.status = 'rejected';
            data.timeResolve = 1;
            await data.save();
            return data;
        }else if (data.timeResolve > 0){
            throw new Error('Request is already resolved');
        }
    }
}
