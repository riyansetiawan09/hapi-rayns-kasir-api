const { PostPenjualanPayloadSchema, getPenjualanPayloadSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const PenjualanValidator = {
  validatePostPenjualanPayload: (payload) => {
    const validationResult = PostPenjualanPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateGetPenjualanPayload: (payload) => {
    const validationResult = getPenjualanPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PenjualanValidator;
