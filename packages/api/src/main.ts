import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true, // ← required for rawBody to work in controllers
  });

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3002',
      'https://artisan-base-storefront.vercel.app',
      'https://artisan-base-dashboard.vercel.app',
    ],
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization', 'X-Tenant-Id'],
    credentials: true,
  });

  // ← Must be before global prefix and cookieParser
  app.use(
    '/api/v1/payments/webhook/stripe',
    express.raw({ type: 'application/json' }),
  );
  app.use(
    '/api/v1/billing/webhook/stripe',
    express.raw({ type: 'application/json' }),
  );

  app.use(cookieParser());
  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Artisan Base API')
    .setDescription('API documentation for the e-commerce app')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 3001;
  await app.listen(port, '0.0.0.0');
  Logger.log(`🚀 API is running on: http://localhost:${port}`);
}
bootstrap();