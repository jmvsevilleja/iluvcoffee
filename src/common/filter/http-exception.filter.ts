import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter<T extends HttpException>
  implements ExceptionFilter
{
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();

    const errorResponse = exception.getResponse();

    const { message, error } =
      typeof errorResponse === 'string'
        ? { message: errorResponse, error: errorResponse }
        : {
            message: (errorResponse as any).message || exception.message,
            error: (errorResponse as any).error || 'Internal Server Error',
          };

    const customErrorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      error,
    };

    response.status(status).json(customErrorResponse);
  }
}
