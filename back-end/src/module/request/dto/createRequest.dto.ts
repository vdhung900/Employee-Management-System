import { Types } from 'mongoose';
import {FileRequestDto} from "../../minio/dto/file-request.dto";

export class CreateRequestDto {
    requestId: string;
    employeeId: Types.ObjectId;
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
