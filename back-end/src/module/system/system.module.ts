import { Module } from '@nestjs/common';
import { SystemService } from './system.service';
import { SystemController } from './system.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {RequestLog, RequestLogSchema} from "../../schemas/request-log.schema";
import {SystemSetting, SystemSettingSchema} from "../../schemas/systemSetting.schema";
import {LeaveSettings, LeaveSettingSchema} from "../../schemas/leaveSettings.schema";

@Module({
  imports: [
      MongooseModule.forFeature([
        {name: RequestLog.name, schema: RequestLogSchema},
        {name: SystemSetting.name, schema: SystemSettingSchema},
        {name: LeaveSettings.name, schema: LeaveSettingSchema},
      ])
  ],
  providers: [SystemService],
  controllers: [SystemController]
})
export class SystemModule {}
