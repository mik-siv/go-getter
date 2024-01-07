import { BadRequestException } from '@nestjs/common';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ObjectLiteral } from '../../types/general.types';

export const validateDto = async (object: ObjectLiteral, dto: ClassConstructor<object>): Promise<boolean> => {
  // transform the request object to class instance
  const dataInstance = plainToInstance(dto, object);

  // get a list of errors
  const errors = await validate(dataInstance);

  // extract error messages from the errors array
  const errorMessages = errors.flatMap(({ constraints }) => Object.values(constraints));

  if (errorMessages.length > 0) {
    throw new BadRequestException(errorMessages);
  } else {
    return true;
  }
};
