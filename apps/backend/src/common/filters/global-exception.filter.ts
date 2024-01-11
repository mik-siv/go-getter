import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';

/**
 * Global exception filter that catches and handles exceptions thrown throughout the application.
 * It provides a standardized error structure in the response and logs the exception information.
 *
 * @class GlobalExceptionFilter
 * @implements {ExceptionFilter}
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  /**
   * Creates an instance of the Constructor class.
   * @param {Logger} logger - The logger object used for logging.
   */
  constructor(private readonly logger: Logger) {}

  /**
   * Handles exceptions thrown during the execution of a request route.
   * @param {unknown} exception - The exception object that was thrown.
   * @param {ArgumentsHost} host - The host object containing the request and response objects.
   * @return {void}
   */
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // Determine the status code
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    // Log the exception
    let errorMessage: string;
    if (exception instanceof HttpException) {
      errorMessage = (exception.getResponse() as any).message || exception.message;
      this.logger.log(`HTTP Status: ${status} Error Message: ${errorMessage}`, exception.stack);
    } else if (exception instanceof Error) {
      errorMessage = exception.message;
      // Now it's safe to log the stack since we know it's an Error object
      this.logger.error(`HTTP Status: ${status} Error Message: ${errorMessage}`, exception.stack);
    } else {
      errorMessage = 'Internal server error';
      this.logger.error(`HTTP Status: ${status} Error Message: ${errorMessage}`);
    }

    // Respond with a standardized error structure
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: errorMessage,
    });
  }
}
