import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; 
import * as cookieParser from 'cookie-parser'; 


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   app.enableCors({
    origin: 'http://localhost:3000', // Your frontend origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed methods
    allowedHeaders: 'Content-Type, Accept, Authorization', // Allowed headers
    credentials: true, // This is the CRITICAL line that was correct
  });
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser()); 
  // app.enableShutdownHooks();
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
