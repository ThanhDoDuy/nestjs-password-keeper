import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston'; // Correct import for winston
import * as winstonDailyRotateFile from 'winston-daily-rotate-file';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { TransformInterceptor } from './interceptors/transform.interceptor';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule, {
  //   logger: WinstonModule.createLogger({
  //     transports: [
  //       new winston.transports.Console({
  //         format: winston.format.combine(
  //           winston.format.timestamp(),
  //           winston.format.json(),
  //         ),
  //       }),
  //       // new winston.transports.File({ filename: 'logs/app.log' }), // Log to file
  //       new winstonDailyRotateFile({
  //         filename: 'logs/app-%DATE%.log',
  //         datePattern: 'YYYY-MM-DD',
  //         zippedArchive: true,
  //         maxSize: '20m',
  //         format: winston.format.combine(
  //           winston.format.timestamp(),
  //           winston.format.json(),
  //         ),
  //       })
  //     ],
  //   }),
  // });
  const app = await NestFactory.create(AppModule);
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new TransformInterceptor(reflector))
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  // enable cors
  app.enableCors(
    {
      "origin": "*",
      "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
      "preflightContinue": false,
      "optionsSuccessStatus": 204
    }
  );
  app.setGlobalPrefix('api');
  // enable Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1', '2']
  });
  await app.listen(process.env.PORT);
}
bootstrap();
