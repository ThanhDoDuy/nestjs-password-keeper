import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use = (req: Request, res: Response, next: NextFunction): void => {
    const { method, originalUrl } = req;
    const start = Date.now();
    this.logger.log(
      `LoggingMiddleware - ${method} ${originalUrl} - ${start}`,
    );
    next();
  }
}
