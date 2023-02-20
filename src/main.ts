import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from '@nestjs/common'
import * as cookiesParser from 'cookie-parser'
import * as express from 'express';
import * as path from 'path';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.enableCors();
  app.use(cookiesParser())
  app.useGlobalPipes(new ValidationPipe())
  
  app.use(express.static(path.join(__dirname, '..', 'public')));
  await app.listen(3500);
}
bootstrap();
