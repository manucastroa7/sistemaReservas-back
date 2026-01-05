
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors(); // Vital para que el frontend NextJS pueda conectar
  // Listen on 0.0.0.0 to handle both IPv4 and IPv6 localhost
  await app.listen(3001, '0.0.0.0');
  console.log(`🚀 Backend running at http://localhost:3001/api`);
}
bootstrap();
