import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston'; // Correct import for winston
import * as winstonDailyRotateFile from 'winston-daily-rotate-file';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';

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
  await app.listen(process.env.PORT);
}
bootstrap();
