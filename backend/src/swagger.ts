import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Trendenden')
  .setDescription('Your API Description')
  .setVersion('1.0')
  .addTag('Auth Documentation')
  .build();
