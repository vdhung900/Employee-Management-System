import { Module } from '@nestjs/common';
import { RequestService } from './request.service';
import {MongooseModule} from "@nestjs/mongoose";
import {Requests, RequestsSchema} from "../../schemas/requests.schema";
import {typeRequest, typeRequestSchema} from "../../schemas/typeRequestCategory.schema";
import { HrRequestController } from './hr-request/hr-request.controller';
import { HrRequestService } from './hr-request/hr-request.service';

@Module({
  imports: [
      MongooseModule.forFeature([
        {name: Requests.name, schema: RequestsSchema},
        {name: typeRequest.name, schema: typeRequestSchema},
      ])
  ],
  providers: [RequestService, HrRequestService],
  controllers: [HrRequestController]
})
export class RequestModule {}
