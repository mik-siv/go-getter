import * as Joi from 'joi';

/**
 * Represents the response schema for goal data.
 * @return {Object} - Joi validation schema for goal response.
 */
export const goalResponseSchema = (): Joi.ObjectSchema => {
  return Joi.object({
    id: Joi.string().required(),
    created_date: Joi.date().required(),
    created_by: Joi.object().allow(null),
    contributors: Joi.array().allow(null),
    subgoals: Joi.array().allow(null),
    metadata: Joi.object({
      description: Joi.string().required(),
    }),
    name: Joi.string().required(),
    parent: Joi.any(),
    private: Joi.boolean().required(),
  });
};
