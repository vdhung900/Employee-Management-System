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
    CategoryModule
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
      { path: 'hr-request/create', method: RequestMethod.POST },
    )
    .forRoutes('*');
  }
}
