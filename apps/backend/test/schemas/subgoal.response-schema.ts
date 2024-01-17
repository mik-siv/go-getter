import * as Joi from 'Joi';
import { userResponseSchema } from './user.response-schema';
import { goalResponseSchema } from './goal.response-schema';

/**
 * Represents the subgoal response schema.
 * @returns {Joi.ObjectSchema} - The Joi object schema for subgoal response.
 */
export const subgoalResponseSchema = (): Joi.ObjectSchema => {
  return Joi.object({
    id: Joi.string().guid().required(),
    name: Joi.string().required(),
    private: Joi.boolean().required(),
    parent: Joi.any(),
    metadata: Joi.object({
      description: Joi.string().required(),
    }).required(),
    created_by: userResponseSchema(),
    goal_subgoals: Joi.array().items(goalResponseSchema()).allow(null),
  });
};
