import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * A class to strip the password field from the responses
 * @class
 */
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, T> {
  /**
   * main intercept method
   * @param {ExecutionContext} context
   * @param {CallHandler} next
   */
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<T> {
    return next.handle().pipe(
      map(data => this.recursivelyStripPasswordField(data)),
    );
  }

  /**
   * A method to recursively strip the password field from responses
   * @param value
   * @private
   */
  private recursivelyStripPasswordField(value: any): any {
    if (Array.isArray(value)) {
      return value.map(item => this.recursivelyStripPasswordField(item));
    }

    if (value instanceof Object) {
      delete value.password; // Adjust this line if your password field is named differently
      Object.keys(value).forEach(key => {
        value[key] = this.recursivelyStripPasswordField(value[key]);
      });
    }

    return value;
  }
}
