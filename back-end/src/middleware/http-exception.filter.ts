import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { Request, Response } from 'express';
  import { BaseResponse } from '../interfaces/response/base.response';
  
  @Catch()
  export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
  
      const isHttpException = exception instanceof HttpException;
  
      const status = isHttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
  
      const exceptionResponse = isHttpException
        ? exception.getResponse()
        : {
            message: exception?.message || 'Internal server error',
          };
  
      const message =
        typeof exceptionResponse === 'object' && exceptionResponse?.['message']
          ? exceptionResponse['message']
          : typeof exceptionResponse === 'string'
          ? exceptionResponse
          : 'Unexpected error';
  
      const data =
        typeof exceptionResponse === 'object' && exceptionResponse?.['data']
          ? exceptionResponse['data']
          : null;
  
      const timestamp = new Date().toISOString();
      const path = request?.url;
  
      response.status(status).json(
        BaseResponse.error(message, data, status, path, timestamp),
      );
    }
  }
  