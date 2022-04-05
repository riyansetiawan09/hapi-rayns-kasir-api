const Joi = require('joi');

const PostPelangganPayloadSchema = Joi.object({
  nama: Joi.string().required(),
  no_telepon: Joi.number().allow(''),
  alamat: Joi.string().allow(''),
  deskripsi: Joi.string().allow(''),
});

module.exports = PostPelangganPayloadSchema;
