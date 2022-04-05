const PostKategoriPayloadSchema = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const KategoriValidator = {
  validatePostKategoriPayload: (payload) => {
    const validationResult = PostKategoriPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = KategoriValidator;
