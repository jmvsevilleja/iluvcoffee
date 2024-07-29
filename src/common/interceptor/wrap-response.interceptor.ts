import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable, tap } from 'rxjs';

@Injectable()
export class WrapResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before WrapResponseInterceptor');
    const response = context.switchToHttp().getResponse();
    // response.setHeader('Content-Type', 'application/json');
    // return next.handle().pipe(tap((data) => console.log('After...', data)));

    console.log('Ending timer for Request-response time');
    console.timeEnd('Request-response time');

    return next.handle().pipe(map((data) => ({ data })));
  }
}
