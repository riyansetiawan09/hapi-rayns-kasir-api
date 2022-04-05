const { PostProdukPayloadSchema, PutProdukPayloadSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const ProdukValidator = {
  validatePostProdukPayload: (payload) => {
    const validationResult = PostProdukPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePutProdukPayload: (payload) => {
    const validationResult = PutProdukPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = ProdukValidator;
