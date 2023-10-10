import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*', // Specify the allowed origin
    methods: 'GET,POST,DELETE', // Specify the allowed HTTP methods
    credentials: true, // Allow credentials (e.g., cookies)
  });
  await app.listen(8000);
}
bootstrap();
