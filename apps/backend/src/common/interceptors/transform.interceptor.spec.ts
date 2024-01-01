import { TransformInterceptor } from './transform.interceptor';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';

describe('TransformInterceptor', () => {
  let interceptor: TransformInterceptor<any>;

  const mockExecutionContext: ExecutionContext = {} as any;
  let mockCallHandler: CallHandler = {
    handle: () => of({}) // Default mock response
  };

  beforeEach(() => {
    interceptor = new TransformInterceptor();
  });

  it('should strip password field from response', done => {
    mockCallHandler.handle = () => of({ password: 'secret', otherData: 'data' });

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe(result => {
      expect(result.password).toBeUndefined();
      expect(result.otherData).toBe('data');
      done();
    });
  });

  it('should strip password fields from nested objects', done => {
    mockCallHandler.handle = () => of({
      user: { password: 'secret', username: 'user1' },
      otherData: 'data'
    });

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe(result => {
      expect(result.user.password).toBeUndefined();
      expect(result.user.username).toBe('user1');
      expect(result.otherData).toBe('data');
      done();
    });
  });

  it('should strip password fields from array of objects', done => {
    mockCallHandler.handle = () => of([
      { password: 'secret1', username: 'user1' },
      { password: 'secret2', username: 'user2' }
    ]);

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe(result => {
      result.forEach(user => {
        expect(user.password).toBeUndefined();
      });
      expect(result[0].username).toBe('user1');
      expect(result[1].username).toBe('user2');
      done();
    });
  });
});
