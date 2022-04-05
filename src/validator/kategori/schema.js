const Joi = require('joi');

const PostKategoriPayloadSchema = Joi.object({
  nama: Joi.string().required(),
  deskripsi: Joi.string().allow(''),
});

module.exports = PostKategoriPayloadSchema;
