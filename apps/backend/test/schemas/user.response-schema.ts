import * as Joi from 'joi';

/**
 * Represents the schema for user response data.
 * @returns {Joi.ObjectSchema} - The user response schema.
 */
export const userResponseSchema = (): Joi.ObjectSchema => {
  return Joi.object({
    id: Joi.string().required(),
    username: Joi.string().required(),
    email: Joi.string().required(),
    roles: Joi.array().required(),
    created_date: Joi.date().required(),
  }).required();
};
