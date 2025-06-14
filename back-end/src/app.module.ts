import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AuthModule } from './module/auth/auth.module';
import { DatabaseModule } from './config/database.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RequestLog, RequestLogSchema } from './schemas/request-log.schema';
import { RequestLoggerMiddleware } from './middleware/request-logger.middleware';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { RequestManageModule } from './module/request-manage/request-manage.module';
import { RequestModule } from './module/request/request.module';
import { CategoryModule } from './module/category/category.module';
import { AdminAccountModule } from './module/admin/admin_account.module';
import { AdminModule } from './module/admin/admin.module';
import { BadRequestException } from '@nestjs/common';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    DatabaseModule,
    MongooseModule.forFeature([
      {name: RequestLog.name, schema: RequestLogSchema}
    ]),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 15
      }
    ]),
    RequestManageModule,
    RequestModule,
    CategoryModule,
    AdminModule,
    AdminAccountModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(RequestLoggerMiddleware)
    .forRoutes("*");

    consumer
    .apply(AuthMiddleware)
    .exclude(
      { path: 'auth/login', method: RequestMethod.POST },
      { path: 'auth/register', method: RequestMethod.POST },
      { path: 'api', method: RequestMethod.GET },
      { path: 'category/type-request/:role', method: RequestMethod.GET },
      { path: 'admin-accounts', method: RequestMethod.POST },
      { path: 'admin-accounts', method: RequestMethod.GET },
      { path: 'admin-accounts/:id', method: RequestMethod.PATCH },
      { path: 'admin-accounts/:id/reset-password', method: RequestMethod.PATCH },
      { path: 'admin-accounts/:id', method: RequestMethod.GET },
      { path: 'admin-accounts/:id', method: RequestMethod.DELETE},
      { path: 'admin-accounts/departments', method: RequestMethod.GET },
      { path: 'admin-accounts/positions', method: RequestMethod.GET },
    )
    .forRoutes('*');
  }
}

 
