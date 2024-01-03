import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

/**
 * A global error catching middleware
 * @class
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  /**
   * Method to handle the exception
   * @param exception - exception object
   * @param host {ArgumentsHost} - a context host
   */
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // Determine the status code
    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    // Respond with a standardized error structure
    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: exception instanceof HttpException ? exception.getResponse() : 'Internal server error',
      });
  }
}
