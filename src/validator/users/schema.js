const Joi = require('joi');

const PostUserPayloadSchema = Joi.object({
  nama: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const PutUserPayloadSchema = Joi.object({
  nama: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().allow(''),
});

module.exports = { PostUserPayloadSchema, PutUserPayloadSchema };
