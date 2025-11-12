import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestLoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const { method, url } = req;
    const start = Date.now();

    this.logger.log(`Incoming Request: ${method} ${url}`);

    res.on('finish', () => {
      this.logger.log(
        `Completed Request: ${method} ${url} - ${res.statusCode} - ${Date.now() - start}ms\n\n`,
      );
    });

    next();
  }
}
