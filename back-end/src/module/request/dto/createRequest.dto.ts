import { Types } from 'mongoose';

export class CreateRequestDto {
    employeeId: Types.ObjectId;
    typeRequest: Types.ObjectId;
    typeCode: string;
    dataReq: Record<string, any>;
    startDate: Date;
    endDate: Date;
    reason: string;
    status: string;
    approverId: Types.ObjectId;
}
