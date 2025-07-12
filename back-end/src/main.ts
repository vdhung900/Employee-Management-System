import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger, ValidationPipe } from "@nestjs/common";
import { HttpExceptionFilter } from "./middleware/http-exception.filter";
import helmet from "helmet";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  //app.setGlobalPrefix('api');
  app.enableCors({
    origin: [
      "http://localhost:3123",
      "http://127.0.0.1:3123",
      "http://63.141.253.242:3123",
      'https://ems.api-score.com'
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  });
  app.use(helmet());

  const config = new DocumentBuilder()
    .setTitle("Employee Management System API")
    .setDescription("The Employee Management System API description")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  const port = parseInt(process.env.PORT || "9123");
  await app.listen(port, "0.0.0.0");
  Logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
