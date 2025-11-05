import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { EmptyStringsToUndefinedPipe } from './common/pipes/empty-strings-to-undefined.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const port = config.get('config.port');

  app.useGlobalPipes(
    new EmptyStringsToUndefinedPipe(),
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  await app.listen(port);
  console.log(`Servidor corriendo en el puerto: ${port}`);
}

bootstrap();
