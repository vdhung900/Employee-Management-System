import { Module, Global } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from 'src/schemas/notification.schema';

@Global() 
@Module({
    imports: [
        MongooseModule.forFeature([
            {name: Notification.name, schema: NotificationSchema },
        ])
    ],
  providers: [NotificationGateway, NotificationService],
  controllers: [NotificationController],
  exports: [NotificationService],
})
export class NotificationModule {}