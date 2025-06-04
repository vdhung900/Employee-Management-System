export class BaseResponse<T = any> {
    status: string;
    success: boolean;
    message: string;
    data?: T | null;
    otherData?: T | null;
    path?: string;
    timestamp?: any;
  
    constructor(partial: Partial<BaseResponse<T>>) {
      Object.assign(this, partial);
    }
  
    static success<T>(data: T, message = 'Success', status): BaseResponse<T> {
      return new BaseResponse<T>({
        status: status,
        success: true,
        message: message,
        data: data,
        otherData: null
      });
    }
  
    static error(message = 'Error', data: any = null, status, path, timestamp): BaseResponse {
      return new BaseResponse({
        status: status,
        message: message,
        data: data,
        success: false,
        path: path,
        timestamp: timestamp
      });
    }
  }
  