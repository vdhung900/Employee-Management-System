import { Module } from '@nestjs/common';
import { UploadController } from './minio.controller';
import { UploadService } from './minio.service';
import {MongooseModule} from "@nestjs/mongoose";
import {Documents, DocumentsSchema} from "../../schemas/documents.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: Documents.name, schema: DocumentsSchema },
        ])
    ],
    controllers: [UploadController],
    providers: [UploadService],
    exports: [UploadService],
})
export class UploadModule {} 
