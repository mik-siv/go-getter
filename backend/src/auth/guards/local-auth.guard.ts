import { BadRequestException, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { plainToInstance } from "class-transformer";
import { UserLoginDto } from "../dtos/user-login.dto";
import { validate } from "class-validator";

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest<Request>();
        const response = context.switchToHttp().getResponse<Response>();

        // transform the request object to class instance
        const body = plainToInstance(UserLoginDto, request.body);

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