import {FileRequestDto} from "../../minio/dto/file-request.dto";

export class DocumentManageDto {
    employeeId: string;
    attachments: FileRequestDto[];
}