import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    console.log('Before LoggingMiddleware');

    // Your code to measure the time of goes here
    console.log('Starting timer for Request-response time');
    console.time('Request-response time');

    next();
  }
}
