import { Module } from '@nestjs/common';
import { RequestManageService } from './request-manage.service';
import { RequestManageController } from './request-manage.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {RequestLog, RequestLogSchema} from "../../schemas/request-log.schema";

@Module({
  imports: [
      MongooseModule.forFeature([
        {name: RequestLog.name, schema: RequestLogSchema},
      ])
  ],
  providers: [RequestManageService],
  controllers: [RequestManageController]
})
export class RequestManageModule {}
