import { Types } from 'mongoose';
import {FileRequestDto} from "../../minio/dto/file-request.dto";
import {BaseReq} from "../../../interfaces/request/baseReq.interface";

export class SystemSettingDto extends BaseReq{
    systemSettingId: Types.ObjectId;
    key: string;
    value: Record<string, any>;
    type: string;
}
