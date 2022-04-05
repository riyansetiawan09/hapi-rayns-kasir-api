class PembelianHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postPembelianHandler = this.postPembelianHandler.bind(this);
    this.getPembelianHandler = this.getPembelianHandler.bind(this);
    this.getPembelianByIdHandler = this.getPembelianByIdHandler.bind(this);
  }

  async postPembelianHandler(request, h) {
    try {
      this._validator.validatePostPembelianPayload(request.payload);
      const { id: userId } = request.auth.credentials;
      const {
        date, invoice, deskripsi, jumlah, diskon, items, kantorId,
      } = request.payload;

      const pembelianId = await this._service.createTransaksi({
        date, invoice, deskripsi, jumlah, diskon, items, userId, kantorId,
      });

      const response = h.response({
        status: 'success',
        message: 'transaksi ditambahkan',
        data: {
          pembelianId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      return error;
    }
  }

  async getPembelianHandler(request) {
    try {

      const { perusahaanId } = request.auth.credentials;
      const { startDate, endDate, page, q } = request.query;

      const { pembelian , meta } = await this._service.getPembelian(perusahaanId, { startDate, endDate, page, q });

      return {
        status: 'success',
        data: {
          pembelian,
          meta,
        },
      };
    } catch (error) {
      return error;
    }
  }

  async getPembelianByIdHandler(request) {
    try {
      const { id: pembelianId } = request.params;
      const pembelian = await this._service.getPembelianById(pembelianId);

      return {
        status: 'success',
        data: {
          pembelian,
        },
      };
    } catch (error) {
      return error;
    }
  }
}

module.exports = PembelianHandler;
