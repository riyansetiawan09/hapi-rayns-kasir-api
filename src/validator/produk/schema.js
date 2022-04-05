const Joi = require('joi');

const PostProdukPayloadSchema = Joi.object({
  kode: Joi.string().required(),
  nama: Joi.string().required(),
  deskripsi: Joi.string().allow(''),
  biaya: Joi.number().required().greater(0),
  harga: Joi.number().required().greater(Joi.ref('biaya')),
  stock: Joi.number().required(),
  kategori_id: Joi.string().guid().required(),
});

const PutProdukPayloadSchema = Joi.object({
  kode: Joi.string().required(),
  nama: Joi.string().required(),
  deskripsi: Joi.string().allow(''),
  biaya: Joi.number().required(),
  harga: Joi.number().required(),
  stock: Joi.number().required(),
  kategori_id: Joi.string().guid().required(),
});

module.exports = { PostProdukPayloadSchema, PutProdukPayloadSchema };
