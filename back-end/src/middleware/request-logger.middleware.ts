import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RequestLog, RequestLogDocument } from '../schemas/request-log.schema';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(
    @InjectModel(RequestLog.name) private requestLogModel: Model<RequestLogDocument>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();

    res.on('finish', async () => {
      const responseTime = Date.now() - start;
      const { method, originalUrl, ip, body, query, headers } = req;
      const { statusCode } = res;


      const userId = (req as any).user ? (req as any).user.userId : null; 

      const filteredHeaders = { ...headers };
      delete filteredHeaders.authorization; 

      const requestLog = new this.requestLogModel({
        method,
        url: originalUrl,
        statusCode,
        ipAddress: ip,
        userId,
        body: method === 'POST' || method === 'PUT' ? body : undefined,
        query,
        headers: filteredHeaders,
        responseTime,
      });

      try {
        await requestLog.save();
      } catch (error) {
        console.error('Error saving request log:', error);
      }
    });

    next();
  }
}