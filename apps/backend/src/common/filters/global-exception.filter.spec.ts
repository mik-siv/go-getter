import { GlobalExceptionFilter } from './global-exception.filter';
import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

describe('GlobalExceptionFilter', () => {
  let filter: GlobalExceptionFilter;
  const mockHttpArgumentsHost = {
    switchToHttp: jest.fn().mockReturnValue({
      getResponse: jest.fn().mockReturnValue({
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }),
      getRequest: jest.fn().mockReturnValue({
        url: '/test-url',
      }),
    }),
  };

  beforeEach(() => {
    filter = new GlobalExceptionFilter();
  });

  it('should handle HttpException correctly', () => {
    const httpException = new HttpException('Test error', HttpStatus.BAD_REQUEST);
    filter.catch(httpException, mockHttpArgumentsHost as unknown as ArgumentsHost);

    const response = mockHttpArgumentsHost.switchToHttp().getResponse();

    expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(response.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.BAD_REQUEST,
      timestamp: expect.any(String),
      path: '/test-url',
      message: 'Test error',
    });
  });

  it('should handle non-HttpException correctly', () => {
    const error = new Error('Generic error');
    filter.catch(error, mockHttpArgumentsHost as unknown as ArgumentsHost);

    const response = mockHttpArgumentsHost.switchToHttp().getResponse();

    expect(response.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(response.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: expect.any(String),
      path: '/test-url',
      message: 'Internal server error',
    });
  });

});
