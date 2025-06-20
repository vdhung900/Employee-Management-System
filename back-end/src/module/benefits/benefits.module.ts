import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Benefits, BenefitSchema } from '../../schemas/benefits.schema';
import { BenefitsController } from './benefits.controller';
import { BenefitsService } from './benefits.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: Benefits.name, schema: BenefitSchema }])],
    controllers: [BenefitsController],
    providers: [BenefitsService],
    exports: [BenefitsService],
})
export class BenefitsModule { } 