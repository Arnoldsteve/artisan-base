import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // <-- 1. Import ValidationPipe


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   // 2. Enable the validation pipeline globally
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
