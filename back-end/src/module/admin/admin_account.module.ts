import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminAccountController } from './admin_account.controller';
import { AdminAccountService } from './admin_account.service';
import { Account, AccountSchema } from '../../schemas/account.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }])],
  controllers: [AdminAccountController],
  providers: [AdminAccountService],
  exports: [AdminAccountService],
})
export class AdminAccountModule {}
