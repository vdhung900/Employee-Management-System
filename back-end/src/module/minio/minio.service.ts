import { Injectable } from '@nestjs/common';
import {
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { s3Client } from '../../config/minio/minio.config';
import { v4 as uuid } from 'uuid';
import { Express } from 'express';
import { Readable } from 'stream';
import { FileResponseDto } from './dto/file-response.dto';
import { ConfigService } from '@nestjs/config';
import {FileRequestDto} from "./dto/file-request.dto";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Documents, DocumentsDocument} from "../../schemas/documents.schema";

@Injectable()
export class UploadService {
    private readonly bucketName = 'employee';
    private readonly minioEndpoint: string;

    constructor(private configService: ConfigService,  @InjectModel(Documents.name) private documentsModel: Model<DocumentsDocument>,) {
        this.minioEndpoint = this.configService.get('MINIO_ENDPOINT') || 'http://localhost:9000';
    }

    async uploadFile(file: Express.Multer.File): Promise<FileResponseDto> {
        const key = `${uuid()}-${file.originalname}`;

        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
            Metadata: {
                'original-name': file.originalname,
                'content-type': file.mimetype,
                'file-size': file.size.toString(),
            },
        });

        await s3Client.send(command);

        return new FileResponseDto({
            key,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            uploadDate: new Date(),
            url: `${this.minioEndpoint}/${this.bucketName}/${key}`
        });
    }

    async deleteFile(key: string) {
        const command = new DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        });

        await s3Client.send(command);
    }

    async getFile(key: string): Promise<{ stream: Readable; contentType: string }> {
        const command = new GetObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        });

        const data = await s3Client.send(command);
        
        if (!data.Body) {
            throw new Error('No file data received');
        }

        // Convert the ReadableStream to Node.js Readable stream
        const stream = Readable.from(data.Body as any);
        
        return {
            stream,
            contentType: data.ContentType || 'application/octet-stream'
        };
    }

    async createNewDocument(req: FileRequestDto[]){
        try{
            if(req.length > 0){
                const insertedDocs = await this.documentsModel.insertMany(req);
                return insertedDocs;
            }else{
                throw new Error('Empty file list.');
            }
        }catch (e) {
            throw new Error(e)
        }
    }
}
