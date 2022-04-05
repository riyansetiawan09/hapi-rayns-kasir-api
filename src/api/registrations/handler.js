class RegistrationsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postRegistrationHandler = this.postRegistrationHandler.bind(this);
  }

  async postRegistrationHandler(request, h) {
    try {
      this._validator.validatePostRegistrationPayload(request.payload);

      const { nama, email, password } = request.payload;

      await this._service.registerStore({ nama, email, password });

      const response = h.response({
        status: 'success',
        message: 'Toko berhasil didaftarkan',
        data: {
          nama, email,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      return error;
    }
  }
}

module.exports = RegistrationsHandler;
