const Joi = require('joi');

const PostPembelianPayloadSchema = Joi.object({
  kantorId: Joi.string().guid().required(),
  date: Joi.date().required(),
  invoice: Joi.string().required(),
  jumlah: Joi.number().required(),
  diskon: Joi.number().required(),
  deskripsi: Joi.string().allow(''),
  items: Joi.array().items(
    Joi.object({
      produkId: Joi.string().guid().required(),
      quantity: Joi.number().required(),
      biaya: Joi.number().required(),
    }),
  ),
});

const getPembelianPayloadSchema = Joi.object({
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  page: Joi.string().allow(''),
  q: Joi.string().allow(''),
});

module.exports = { PostPembelianPayloadSchema, getPembelianPayloadSchema };
