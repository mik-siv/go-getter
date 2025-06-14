import * as Joi from 'joi';

export const validationSchema = Joi.object({
  PGHOST: Joi.string().required(),
  PGDATABASE: Joi.string().required(),
  PGUSER: Joi.string().required(),
  PGPASSWORD: Joi.string().required(),
  PGPORT: Joi.string().required(),
  JWTSECRET: Joi.string().required(),
  CLOUDINARY_NAME: Joi.string().required(),
  CLOUDINARY_API_KEY: Joi.string().required(),
  CLOUDINARY_API_SECRET: Joi.string().required(),
  CLOUDINARY_API_URL: Joi.string().required(),
}).required();
