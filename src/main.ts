import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
//import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import { WrapResponseInterceptor } from './common/interceptor/wrap-response.interceptor';
// import { ApiKeyGuard } from './common/guard/api-key.guard';

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
  app.useGlobalFilters(new HttpExceptionFilter());
  // app.useGlobalGuards(new ApiKeyGuard())
  app.useGlobalInterceptors(new WrapResponseInterceptor());
  await app.listen(3000);
}
bootstrap();
