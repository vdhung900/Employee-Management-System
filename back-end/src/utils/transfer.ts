import { Readable } from 'stream';

export function base64ToMulterFile(base64: string, fileName: string): Express.Multer.File {
    const buffer = Buffer.from(base64, 'base64');

    return {
        fieldname: 'file',
        originalname: fileName,
        encoding: '7bit',
        mimetype: 'application/pdf',
        size: buffer.length,
        buffer,
        stream: Readable.from(buffer),
        destination: '',
        filename: fileName,
        path: '',
    } as Express.Multer.File;
}
