import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter<T extends HttpException> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();

    // Get the detailed error response
    const errorResponse = exception.getResponse();

    // Handle the case where errorResponse might be a string or an object
    const message = typeof errorResponse === 'string'
    ? errorResponse
    : (errorResponse as any).message || exception.message;

    const error = typeof errorResponse === 'string'
    ? errorResponse
    : (errorResponse as any).error || 'Internal Server Error';

    const customErrorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
      error: error,
    };
    response.status(status).json(customErrorResponse);
  }
}
