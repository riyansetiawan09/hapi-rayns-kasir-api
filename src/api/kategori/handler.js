class KategoriHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postKategoriHandler = this.postKategoriHandler.bind(this);
    this.getKategoriHandler = this.getKategoriHandler.bind(this);
    this.getKategoriByIdHandler = this.getKategoriByIdHandler.bind(this);
    this.putKategoriHandler = this.putKategoriHandler.bind(this);
    this.deleteKategoriHandler = this.deleteKategoriHandler.bind(this);
  }

  async postKategoriHandler(request, h) {
    try {
      this._validator.validatePostKategoriPayload(request.payload);

      const { perusahaanId } = request.auth.credentials;
      const { nama, deskripsi } = request.payload;

      const kategoriId = await this._service.addKategori({
        nama, deskripsi, perusahaanId,
      });

      const response = h.response({
        status: 'success',
        message: 'Kategori berhasil ditambahkan',
        data: {
          kategoriId,
          nama,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      return error;
    }
  }

  async getKategoriHandler(request) {
    try {
      const { perusahaanId } = request.auth.credentials;
      const { page, q } = request.query;
      const { kategori, meta } = await this._service.getKategori(perusahaanId, { page, q });

      return {
        status: 'success',
        data: { kategori, meta },
      };
    } catch (error) {
      return error;
    }
  }

  async getKategoriByIdHandler(request) {
    try {
      const { id: kategoriId } = request.params;
      const kategori = await this._service.getKategoriById(kategoriId);

      return {
        status: 'success',
        data: {
          kategori,
        },
      };
    } catch (error) {
      return error;
    }
  }

  async putKategoriHandler(request) {
    try {
      this._validator.validatePostKategoriPayload(request.payload);
      const { id: kategoriId } = request.params;
      const { nama, deskripsi } = request.payload;

      await this._service.updateKategoriById(kategoriId, { nama, deskripsi });

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

  async deleteKategoriHandler(request) {
    try {
      const { id: kategoriId } = request.params;
      await this._service.deleteKategoriById(kategoriId);

      return {
        status: 'success',
        data: {},
      };
    } catch (error) {
      return error;
    }
  }
}

module.exports = KategoriHandler;
