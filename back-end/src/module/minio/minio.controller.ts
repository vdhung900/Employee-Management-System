import {
    Controller,
    Post,
    Get,
    Delete,
    Param,
    UseInterceptors,
    UploadedFile,
    Res,
    HttpException,
    HttpStatus,
    Body
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { UploadService } from './minio.service';
import { ApiTags, ApiConsumes, ApiBody, ApiParam, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BaseResponse } from "../../interfaces/response/base.response";
import { FileResponseDto } from './dto/file-response.dto';
import {FileRequestDto} from "./dto/file-request.dto";

@ApiTags('files')
@Controller('files')
export class UploadController {
    constructor(private readonly uploadService: UploadService) {}

    @Post('upload')
    @ApiOperation({ summary: 'Upload a file' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: 'File uploaded successfully',
        type: FileResponseDto
    })
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        try {
            if (!file) {
                throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
            }
            const fileResponse = await this.uploadService.uploadFile(file);
            return BaseResponse.success(fileResponse, 'File uploaded successfully', HttpStatus.OK);
        } catch (error) {
            throw new HttpException(
                error.message || 'Error uploading file',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get(':key')
    @ApiOperation({ summary: 'Download a file' })
    @ApiParam({ name: 'key', description: 'File key/name to download' })
    async getFile(@Param('key') key: string, @Res() res: Response) {
        try {
            const { stream, contentType } = await this.uploadService.getFile(key);
            res.setHeader('Content-Type', contentType);
            stream.pipe(res);
        } catch (error) {
            throw new HttpException(
                'Error downloading file',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get('presigned/:key')
    @ApiOperation({ summary: 'Get file preview' })
    @ApiParam({ name: 'key', description: 'File key/name to preview' })
    async getPresignedUrl(@Param('key') key: string) {
        try {
            const url = await this.uploadService.getPresignedUrl(key);
            return BaseResponse.success(url, 'File preview successfully', HttpStatus.OK);
        } catch (error) {
            throw new HttpException(
                'Error downloading file',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Delete(':key')
    @ApiOperation({ summary: 'Delete a file' })
    @ApiParam({ name: 'key', description: 'File key/name to delete' })
    async deleteFile(@Param('key') key: string) {
        try {
            await this.uploadService.deleteFile(key);
            return BaseResponse.success(null, 'File deleted successfully', HttpStatus.OK);
        } catch (error) {
            throw new HttpException(
                'Error deleting file',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
} 
