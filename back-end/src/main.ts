import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { HttpExceptionFilter } from './middleware/http-exception.filter';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors({
    // origin: process.env.FE_URL || 'http://localhost:3000', // Commented for local development
    origin: 'http://103.82.22.29:3123', // Production URL
    method: 'GET, HEAD, PUT, PATCH, POST, DELETE',
    credentials: true
  })
  app.use(helmet());

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Employee Management System API')
    .setDescription('The Employee Management System API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = 9123; // Fixed port for production
  await app.listen(port, '0.0.0.0'); // Listen on all network interfaces
  Logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
