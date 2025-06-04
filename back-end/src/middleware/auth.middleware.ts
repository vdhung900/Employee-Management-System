import { HttpCode, HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';

export interface CustomRequest extends Request {
  user?: any;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: CustomRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      throw new HttpException({message: 'Access denied. No token provided.'}, HttpStatus.UNAUTHORIZED);
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      

      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < now) {
        throw new HttpException({message: 'Token has expired.'}, HttpStatus.UNAUTHORIZED);
      }

      req.user = decoded;
      next();
    } catch (err) {
      throw new HttpException({message: 'Invalid token.'}, HttpStatus.UNAUTHORIZED);
    }
  }
}