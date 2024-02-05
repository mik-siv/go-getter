import * as Joi from 'Joi';

/**
 * Represents the subgoal response schema.
 * @returns {Joi.ObjectSchema} - The Joi object schema for subgoal response.
 */
export const subgoalResponseSchema = (): Joi.ObjectSchema => {
  return Joi.object({
    id: Joi.string().guid().required(),
    name: Joi.string().required(),
    created_by: Joi.object().allow(null),
    goal_subgoals: Joi.array().allow(null),
    private: Joi.boolean().required(),
    parent: Joi.any(),
    metadata: Joi.object({
      description: Joi.string().allow('').required(),
    }).required(),
  });
};
