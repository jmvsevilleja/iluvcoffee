import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // global scope
/* This code snippet is setting up a global validation pipe in a Nest.js application. Here's what each
option in the `ValidationPipe` configuration does: */
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //     transform: true,
  //     forbidNonWhitelisted: true,
  //     transformOptions: {
  //       enableImplicitConversion: true,
  //     },
  //   }),
  // );
  app.useGlobalFilters(new HttpExceptionFilter)
  await app.listen(3000);
}
bootstrap();