import {Injectable} from '@nestjs/common';
import {
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import {s3Client} from '../../config/minio/minio.config';
import {v4 as uuid} from 'uuid';
import {Express} from 'express';
import {Readable} from 'stream';
import {FileResponseDto} from './dto/file-response.dto';
import {ConfigService} from '@nestjs/config';
import {FileRequestDto} from "./dto/file-request.dto";
import {InjectModel} from "@nestjs/mongoose";
import {Model, Types} from "mongoose";
import {Documents, DocumentsDocument} from "../../schemas/documents.schema";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class UploadService {
    private readonly bucketName = 'employee';
    private readonly minioEndpoint: string;

    constructor(private configService: ConfigService, @InjectModel(Documents.name) private documentsModel: Model<DocumentsDocument>,) {
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
            url: `${this.minioEndpoint}/${this.bucketName}/${key}`,
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

    async saveAndReplace(req: FileRequestDto[]) {
        try {
            for (const item of req) {
                if (item._id) {
                    await this.documentsModel.findByIdAndDelete(new Types.ObjectId(item._id));
                }
            }
            console.log(req)
            const insertedDocs = await this.documentsModel.insertMany(req);
            return insertedDocs;
        } catch (e) {
            throw new Error(e.message)
        }
    }

    async getPresignedUrl(key: string, expiresInSeconds = 3600): Promise<string> {
        try{
            const command = new GetObjectCommand({
                Bucket: this.bucketName,
                Key: key,
            });
            const url = await getSignedUrl(s3Client, command, {
                expiresIn: expiresInSeconds,
            });
            return url;
        }catch (e) {
            throw new Error(e.message)
        }
    }

    async delete(req: FileRequestDto) {
        try {
            const data = await this.documentsModel.findByIdAndDelete(new Types.ObjectId(req._id)).exec();
            return data;
        } catch (e) {
            throw new Error(e.message)
        }
    }
}
