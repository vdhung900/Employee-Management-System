import { S3Client } from '@aws-sdk/client-s3';

export const s3Client = new S3Client({
    region: 'us-east-1',
    endpoint: process.env.MINIO_ENDPOINT,
    credentials: {
        accessKeyId: process.env.MINIO_USERNAME!,
        secretAccessKey: process.env.MINIO_PASSWORD!,
    },
    forcePathStyle: true,
});
