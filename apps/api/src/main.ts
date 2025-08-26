import '@google-cloud/trace-agent';
import { LogLevel, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { json, urlencoded } from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { join } from 'path';
import favicon from 'serve-favicon';
import { AppModule } from './app/app.module';

if (process.env.IS_DOCKER !== 'true') {
  const envPath = join(__dirname, `../.env.${process.env.NODE_ENV || 'development'}`);
  console.info('Loading .env file from:', envPath);
  dotenv.config({ path: envPath });
} else {
  console.info('Not loading .env file in docker');
}

const defaultLogLevels: LogLevel[] =
  process.env.NODE_ENV === 'development'
    ? ['verbose', 'debug', 'log', 'warn', 'error', 'fatal']
    : ['log', 'error', 'fatal'];

function parseLogLevelEnv(value: string | undefined): LogLevel[] {
  if (!value) return defaultLogLevels;
  try {
    const parsed = JSON.parse(value) as LogLevel[];
    if (!Array.isArray(parsed)) {
      // noinspection ExceptionCaughtLocallyJS - we want to handle this manually
      throw new Error('Log level must be an array');
    }
    const allowed = defaultLogLevels;
    return parsed.filter((level): level is LogLevel => allowed.includes(level));
  } catch (e) {
    console.warn('Invalid NEST_LOG_LEVEL in env:', e);
    return defaultLogLevels;
  }
}

async function bootstrap() {
  const logMethods = parseLogLevelEnv(process.env.NEST_LOG_LEVEL);
  const app = await NestFactory.create(AppModule, { bodyParser: false, logger: logMethods });

  app.enableCors({
    origin: process.env.CROSS_ORIGIN_ORIGIN,
    credentials: true,
  });
  app.enableShutdownHooks();
  app.enableVersioning({ type: VersioningType.URI });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      skipMissingProperties: true,
    }),
  );

  app.use(
    compression(),
    favicon(join(__dirname, '/assets/favicon.ico')),
    json({ limit: '50mb' }),
    urlencoded({ limit: '50mb', extended: true }),
  );

  app.use(cookieParser());

  const port = process.env.PORT || 8080;
  await app.listen(port);
}

await bootstrap();
