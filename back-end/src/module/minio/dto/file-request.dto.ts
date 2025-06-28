import {Types} from "mongoose";

export class FileRequestDto {
    _id: string;
    key: string;
    originalName: string;
    mimeType: string;
    size: number;
    uploadDate: Date;
    url?: string;
}
