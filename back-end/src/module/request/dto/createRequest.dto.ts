import { Types } from 'mongoose';
import {FileRequestDto} from "../../minio/dto/file-request.dto";
import {BaseReq} from "../../../interfaces/request/baseReq.interface";

export class CreateRequestDto extends BaseReq{
    requestId: string;
    employeeId: Types.ObjectId;
    departmentId: Types.ObjectId;
    typeRequest: Types.ObjectId;
    typeCode: string;
    dataReq: Record<string, any>;
    reason: string;
    status: string;
    priority: string;
    note: string;
    attachments: any;
    approverId: Types.ObjectId;
}
