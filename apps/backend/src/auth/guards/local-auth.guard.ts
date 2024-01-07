import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ClassConstructor } from 'class-transformer';
import { Reflector } from '@nestjs/core';
import { DTO_KEY } from '../../common/decorators/set-dto.decorator';
import { validateDto } from '../../common/utils/validation/dto-validation.util';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  constructor(private reflector: Reflector) {
    super();
  }
  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest<Request>();
    const dto = this.reflector.get<ClassConstructor<object>>(DTO_KEY, context.getHandler());
    await validateDto(request.body, dto);
    return super.canActivate(context) as boolean | Promise<boolean>;
  }
}
