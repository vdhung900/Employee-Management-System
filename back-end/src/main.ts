import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { HttpExceptionFilter } from './middleware/http-exception.filter';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors({
    origin: process.env.FE_URL || 'http://localhost:3000',
    method: 'GET, HEAD, PUT, PATCH, POST, DELETE',
    credentials: true
  })
  app.use(helmet());

  const config = new DocumentBuilder()
    .setTitle('Employee Management API')
    .setDescription('API documentation for Employee Management System')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  if(process.env.NODE_ENV === 'prod'){
    const port = process.env.PORT || 3000;
    await app.listen(port);
    Logger.log(`Application is running on: ${await app.getUrl()}`);
  }else if(process.env.NODE_ENV === 'dev'){
    const port = getRandomInt(30000, 40000);
    await app.listen(port);
    Logger.log(`Application is running on: ${await app.getUrl()}`);
  }
}
bootstrap();
