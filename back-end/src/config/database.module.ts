import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Logger } from '@nestjs/common';
import mongoose from 'mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
        useFactory: () => ({
          uri: process.env.DB_URL_LOCAL || 'mongodb://localhost:27017/employee_manage',
          useNewUrlParser: true,
          useUnifiedTopology: true,
          retryAttempts: 5
        })
      })
  ],
  exports: [MongooseModule]
})
export class DatabaseModule {
    
}