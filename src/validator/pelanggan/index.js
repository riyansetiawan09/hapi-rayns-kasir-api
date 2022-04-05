const PostPelangganPayloadSchema = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const PelangganValidator = {
  validatePosPelangganPayload: (payload) => {
    const validationResult = PostPelangganPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PelangganValidator;
