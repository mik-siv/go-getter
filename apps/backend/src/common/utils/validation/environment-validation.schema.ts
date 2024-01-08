import * as Joi from 'joi';

export const validationSchema = Joi.object({
  PGHOST: Joi.string().required(),
  PGDATABASE: Joi.string().required(),
  PGUSER: Joi.string().required(),
  PGPASSWORD: Joi.string().required(),
  PGPORT: Joi.string().required(),
  JWTSECRET: Joi.string().required(),
}).required();
