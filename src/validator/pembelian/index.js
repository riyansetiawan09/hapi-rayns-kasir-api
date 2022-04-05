const { PostPembelianPayloadSchema, getPembelianPayloadSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const PembelianValidator = {
  validatePostPembelianPayload: (payload) => {
    const validationResult = PostPembelianPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validategetPembelianPayload: (payload) => {
    const validationResult = getPembelianPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PembelianValidator;
