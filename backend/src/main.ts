import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  // Quick environment checks to help debug missing JWT secret / port issues
  // Do NOT log secrets themselves — only whether they're present
  const jwtSecretPresent = Boolean(process.env.JWT_SECRET);
  const configuredPort = process.env.PORT ?? '3001';

  console.log('Startup check: JWT_SECRET set?', jwtSecretPresent);
  console.log('Startup check: PORT =', configuredPort);

  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Enable global validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  try {
    await app.listen(process.env.PORT ?? 3001);
  } catch (err: any) {
    if (err?.code === 'EADDRINUSE') {
      console.error(
        `Port ${process.env.PORT ?? 3001} is already in use. Stop other instances or change PORT in ".env".`,
      );
    }
    throw err;
  }
}
bootstrap();
