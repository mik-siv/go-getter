import { SetMetadata } from "@nestjs/common";
import { ClassConstructor } from "class-transformer";

export const DTO_KEY = 'routeDto';
export const RouteDto = (arg: ClassConstructor<object>) => SetMetadata(DTO_KEY, arg);