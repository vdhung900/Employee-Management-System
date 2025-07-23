import { Types } from 'mongoose';
import {BaseReq} from "../../../interfaces/request/baseReq.interface";

export class LeaveSettingDto extends BaseReq{
    leaveSettingId: Types.ObjectId;
    code: string;
    name: string;
    description: string;
    maxDaysPerYear: number;
    isPaid: Boolean;
    isActive: Boolean;
    note: string;
}
