import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
// import { WrapResponseInterceptor } from './common/interceptor/wrap-response.interceptor';
import { TimeoutInterceptor } from './common/interceptor/timeout.interceptor';
// import { ApiKeyGuard } from './common/guard/api-key.guard';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('I Love Coffee')
    .setDescription('Coffee Application')
    .setVersion('1.0')
    .addApiKey(
      { type: 'apiKey', in: 'header', name: 'Authorization' },
      'Authorization',
    )
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  // global scope
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
  app.useGlobalInterceptors(
    // new WrapResponseInterceptor(),
    new TimeoutInterceptor(),
  );
  await app.listen(3000);
}
bootstrap();
