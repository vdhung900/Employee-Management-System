import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Requests, RequestsDocument} from "../../schemas/requests.schema";
import {Model, Types} from "mongoose";
import {typeRequest, typeRequestDocument} from "../../schemas/typeRequestCategory.schema";
import {CreateRequestDto} from "./dto/createRequest.dto";
import {UploadService} from "../minio/minio.service";

@Injectable()
export class RequestService {
    constructor(
        @InjectModel(Requests.name) private readonly requestModel: Model<RequestsDocument>,
        @InjectModel(typeRequest.name) private readonly typeRequestModel: Model<typeRequestDocument>,
        private readonly uploadService: UploadService
    ) {
    }

    async create(requestData: CreateRequestDto) {
        const newRequest = new this.requestModel(requestData);
        newRequest.attachments = requestData.attachments ? requestData.attachments.map(item => item._id) : [];
        await newRequest.save()
        return this.findById(newRequest._id);
    }

    async findAll() {
        return await this.requestModel.find().populate('employeeId').populate('typeRequest').exec();
    }

    async findById(id: any) {
        return await this.requestModel.findById(id).populate('employeeId').populate('typeRequest').exec();
    }

    async findByTypeCode(typeRequestId: Types.ObjectId) {
        return await this.requestModel.find({typeRequest: typeRequestId}).populate('employeeId').populate('typeRequest').populate('attachments').exec();
    }

    async findByEmployeeId(employeeId: string) {
        return await this.requestModel.find({employeeId: employeeId}).populate('employeeId').populate('typeRequest').populate('attachments').exec();
    }

    async update(id: string, updateData: CreateRequestDto) {
        const data = await this.requestModel.findById(id).populate('employeeId').populate('typeRequest').exec();
        if (!data) {
            throw new Error('Request not found');
        }
        if(updateData.attachments.length > 0){
            const dataRes = await this.uploadService.saveAndReplace(updateData.attachments);
            data.attachments = Array.isArray(dataRes)
                ? dataRes
                    .filter(item => item && item._id)
                    .map(item => new Types.ObjectId(item._id as string)
                    )
                : [];
        }else{
            data.attachments = [];
        }
        data.priority = updateData.priority;
        data.note = updateData.note;
        data.updatedAt = new Date();
        if(updateData.typeCode === 'ACCOUNT_CREATE_REQUEST'){
            data.dataReq = {
                fullName: updateData.dataReq.fullName,
                email: updateData.dataReq.email,
                phone: updateData.dataReq.phone,
                position: updateData.dataReq.position,
                department: updateData.dataReq.department,
                startDate: updateData.dataReq.startDate,
            }
        }
        return await data.save();
    }

    async delete(id: string) {
        const data = await this.requestModel.findByIdAndDelete(id).exec();
        if (!data) {
            throw new Error('Request not found');
        }
        return data;
    }

    async approve(id: string, status: string, reason?: string){
        const data = await this.findById(id);
        if(!data){
            throw new Error('Request not found');
        }
        if(status === 'Approved'){
            if(data.status !== 'Pending'){
                throw new Error('Request is not pending');
            }
            data.status = 'Approved';
            data.timeResolve = 1;
            await data.save();
        }else if(status === 'Rejected'){
            if(data.status !== 'Pending' && data.status !== 'Approved'){
                throw new Error('Request is not pending or approved');
            }
            data.status = 'Rejected';
            data.reason = reason || 'No reason provided';
            data.timeResolve = 1;
            await data.save();
        }else if (status === "Cancelled") {
            if(data.status !== 'Pending'){
                throw new Error('Request is not pending');
            }
            data.status = 'Cancelled';
            data.timeResolve = 1;
            await data.save();
        }
        else if (data.timeResolve > 0){
            throw new Error('Request is already resolved');
        }
    }
}
