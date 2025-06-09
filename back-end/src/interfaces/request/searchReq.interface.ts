import {BaseReq} from "./baseReq.interface";

export class SearchReq extends BaseReq {
    type?: 'week' | 'month' | 'year' | 'all' | 'custom';
    value?: number;
    year?: number;
    startDate?: Date;
    endDate?: Date;
}