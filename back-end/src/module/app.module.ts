import { Module } from '@nestjs/common';
import { BenefitsModule } from './benefits/benefits.module';

@Module({
    imports: [
        BenefitsModule,
    ],
})
export class AppModule { } 