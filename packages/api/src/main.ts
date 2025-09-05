import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:3000', 
      'http://localhost:3002', 
      'https://artisan-base-storefront.vercel.app'
    ],
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
    // allowedHeaders: 'Content-Type, Accept, Authorization, x-tenant-id',
     allowedHeaders: [
    'Content-Type',
    'Accept',
    'Authorization',
    'X-Tenant-Id',
  ],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, // <-- Add this property
    }),
  );
  app.use(cookieParser());
  app.setGlobalPrefix('api/v1');

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  Logger.log(`🚀 API is running on: http://localhost:${port}`);
}
bootstrap();