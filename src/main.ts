import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
// import { BodyParser } from 'body-parser';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useGlobalFilters(new HttpExceptionFilter());
  
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(5500);
}
bootstrap();
