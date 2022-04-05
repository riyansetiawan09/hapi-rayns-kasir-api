class PenjualanHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postPenjualanHandler = this.postPenjualanHandler.bind(this);
    this.getPenjualanHandler = this.getPenjualanHandler.bind(this);
    this.getPenjualanByIdHandler = this.getPenjualanByIdHandler.bind(this);
  }

  async postPenjualanHandler(request, h) {
    try {
      this._validator.validatePostPenjualanPayload(request.payload);
      const { id: userId } = request.auth.credentials;
      const {
        date, invoice, deskripsi, jumlah, diskon, items, kantorId, pelangganId,
      } = request.payload;

      const penjualanId = await this._service.createTransaksi({
        date, invoice, deskripsi, jumlah, diskon, items, userId, kantorId, pelangganId,
      });

      const response = h.response({
        status: 'success',
        message: 'Transaksi ditambahkan',
        data: {
          penjualanId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      return error;
    }
  }

  async getPenjualanHandler(request) {
    try {
      this._validator.validateGetPenjualanPayload(request.query);

      const { perusahaanId } = request.auth.credentials;
      const {
        startDate, endDate, page, q, pelangganId,
      } = request.query;

      const { penjualan, meta } = await this._service.getPenjualan(perusahaanId, {
        startDate, endDate, page, q, pelangganId,
      });

      return {
        status: 'success',
        data: {
          penjualan,
          meta,
        },
      };
    } catch (error) {
      return error;
    }
  }

  async getPenjualanByIdHandler(request) {
    try {
      const { id: penjualanId } = request.params;
      const penjualan = await this._service.getPenjualanById(penjualanId);

      return {
        status: 'success',
        data: {
          penjualan,
        },
      };
    } catch (error) {
      return error;
    }
  }
}

module.exports = PenjualanHandler;
