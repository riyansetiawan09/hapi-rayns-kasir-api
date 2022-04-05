class PelangganHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postPelangganHandler = this.postPelangganHandler.bind(this);
    this.getPelangganHandler = this.getPelangganHandler.bind(this);
    this.getPelangganByIdHandler = this.getPelangganByIdHandler.bind(this);
    this.putPelangganByIdHandler = this.putPelangganByIdHandler.bind(this);
    this.deletePelangganByIdHandler = this.deletePelangganByIdHandler.bind(this);
  }

  async postPelangganHandler(request, h) {
    try {
      this._validator.validatePosPelangganPayload(request.payload);

      const { perusahaanId } = request.auth.credentials;
      const { nama, no_telepon, alamat, deskripsi } = request.payload;

      const pelangganId = await this._service.addPelanggan({
        nama, no_telepon, alamat, deskripsi, perusahaanId,
      });

      const response = h.response({
        status: 'success',
        message: 'Pelanggan berhasil ditambahkan',
        data: {
          pelangganId,
          nama,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      return error;
    }
  }

  async getPelangganHandler(request) {
    try {
      const { perusahaanId } = request.auth.credentials;
      const { page, q } = request.query;
      const { pelanggan, meta } = await this._service.getPelanggan(perusahaanId, { page, q });

      return {
        status: 'success',
        data: { pelanggan, meta },
      };
    } catch (error) {
      return error;
    }
  }

  async getPelangganByIdHandler(request) {
    try {
      const { id: pelangganId } = request.params;
      const pelanggan = await this._service.getPelangganById(pelangganId);

      return {
        status: 'success',
        data: {
          pelanggan,
        },
      };
    } catch (error) {
      return error;
    }
  }

  async putPelangganByIdHandler(request) {
    try {
      this._validator.validatePosPelangganPayload(request.payload);
      const { id: pelangganId } = request.params;
      const { nama, no_telepon, alamat, deskripsi } = request.payload;

      await this._service.updatePelangganById(pelangganId, { nama, no_telepon, alamat, deskripsi });

      return {
        status: 'success',
        data: {
          nama,
        },
      };
    } catch (error) {
      return error;
    }
  }

  async deletePelangganByIdHandler(request) {
    try {
      const { id: pelangganId } = request.params;

      await this._service.deletePelangganById(pelangganId);

      return {
        status: 'success',
        data: {},
      };
    } catch (error) {
      return error;
    }
  }
}

module.exports = PelangganHandler;
