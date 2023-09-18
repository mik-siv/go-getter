import { BadRequestException, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ClassConstructor, plainToInstance } from "class-transformer";
import { UserLoginDto } from "../dtos/user-login.dto";
import { validate } from "class-validator";
import { Reflector } from "@nestjs/core";
import { DTO_KEY } from "decorators/set-dto.decorator";

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    constructor(private reflector: Reflector) {
        super()
    }
    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest<Request>();
        const dto = this.reflector.get<ClassConstructor<object>>(DTO_KEY, context.getHandler());
        // transform the request object to class instance
        const body = plainToInstance(dto, request.body);

        // get a list of errors
        const errors = await validate(body);

        // extract error messages from the errors array
        const errorMessages = errors.flatMap(({ constraints }) =>
            Object.values(constraints),
        );

        if (errorMessages.length > 0) {
            throw new BadRequestException(errorMessages)
        }

        return super.canActivate(context) as boolean | Promise<boolean>;
    }
}