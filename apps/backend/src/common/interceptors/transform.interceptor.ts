import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, T> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<T> {
    return next.handle().pipe(
      map(data => this.recursivelyStripPasswordField(data)),
    );
  }

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
