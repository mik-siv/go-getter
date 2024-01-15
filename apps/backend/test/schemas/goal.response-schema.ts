import * as Joi from 'joi';
import { userResponseSchema } from './user.response-schema';

/**
 * Represents the response schema for goal data.
 * @return {Object} - Joi validation schema for goal response.
 */
export const goalResponseSchema = (): Joi.ObjectSchema => {
  return Joi.object({
    id: Joi.string().required(),
    created_date: Joi.date().required(),
    subgoals: Joi.array().allow(null),
    metadata: Joi.object({
      description: Joi.string().required(),
    }),
    created_by: userResponseSchema(),
    name: Joi.string().required(),
    parent: Joi.any(),
    private: Joi.boolean().required(),
    contributors: Joi.array().items(userResponseSchema()).required(),
  });
};
