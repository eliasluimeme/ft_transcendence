import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { swaggerConfig } from './swagger';
import { SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000', // Specify the allowed origin
    methods: 'GET,POST,DELETE', // Specify the allowed HTTP methods
    credentials: true, // Allow credentials (e.g., cookies)
  });

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(3001);
}
bootstrap();
