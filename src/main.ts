import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefijo global para todas las rutas
  app.setGlobalPrefix('api');

  // Configuración profesional de CORS
  app.enableCors({
    origin: true, // En producción, mejor poner la URL de Vercel específica
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Escuchar en el puerto que asigne Railway o 3001 en local
  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Server ready on port ${port}`);
}
bootstrap();