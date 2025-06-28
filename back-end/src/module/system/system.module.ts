import { Module } from '@nestjs/common';
import { SystemService } from './system.service';
import { SystemController } from './system.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {RequestLog, RequestLogSchema} from "../../schemas/request-log.schema";

@Module({
  imports: [
      MongooseModule.forFeature([
        {name: RequestLog.name, schema: RequestLogSchema},
      ])
  ],
  providers: [SystemService],
  controllers: [SystemController]
})
export class SystemModule {}
