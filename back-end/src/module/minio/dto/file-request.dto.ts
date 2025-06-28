import {Types} from "mongoose";

export class FileRequestDto {
    key: string;
    originalName: string;
    mimeType: string;
    size: number;
    uploadDate: Date;
    url?: string;
}
