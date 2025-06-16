import { Module } from '@nestjs/common';
import { TypeRequestController } from './type-request/type-request.controller';
import { TypeRequestService } from './type-request/type-request.service';
import {MongooseModule} from "@nestjs/mongoose";
import {typeRequest, typeRequestSchema} from "../../schemas/typeRequestCategory.schema";

@Module({
  imports: [
      MongooseModule.forFeature([
        {name: typeRequest.name, schema: typeRequestSchema}
      ])
  ],
  controllers: [TypeRequestController],
  providers: [TypeRequestService]
})
export class CategoryModule {}
