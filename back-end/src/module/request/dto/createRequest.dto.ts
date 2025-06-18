import { Types } from 'mongoose';

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
    approverId: Types.ObjectId;
}
