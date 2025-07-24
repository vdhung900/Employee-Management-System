import * as crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;

export function encryptBuffer(buffer: Buffer, key: string): Buffer {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, crypto.createHash('sha256').update(key).digest(), iv);

    const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
    const authTag = cipher.getAuthTag();

    // Kết quả = iv + authTag + dữ liệu mã hóa
    return Buffer.concat([iv, authTag, encrypted]);
}

export function decryptBuffer(encryptedBuffer: Buffer, key: string): Buffer {
    const iv = encryptedBuffer.slice(0, IV_LENGTH);
    const authTag = encryptedBuffer.slice(IV_LENGTH, IV_LENGTH + 16);
    const data = encryptedBuffer.slice(IV_LENGTH + 16);

    const decipher = crypto.createDecipheriv(ALGORITHM, crypto.createHash('sha256').update(key).digest(), iv);
    decipher.setAuthTag(authTag);

    return Buffer.concat([decipher.update(data), decipher.final()]);
}
