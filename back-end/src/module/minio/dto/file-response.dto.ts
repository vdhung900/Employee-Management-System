export class FileResponseDto {
    key: string;
    originalName: string;
    mimeType: string;
    size: number;
    uploadDate: Date;
    url?: string;

    constructor(partial: Partial<FileResponseDto>) {
        Object.assign(this, partial);
    }
} 
