import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log('Server is running on port 5000');
  app.enableCors();
  await app.listen(5000);
}
bootstrap();
