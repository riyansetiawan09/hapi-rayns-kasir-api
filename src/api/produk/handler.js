class ProdukHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postProdukHandler = this.postProdukHandler.bind(this);
    this.getProdukHandler = this.getProdukHandler.bind(this);
    this.getProdukByIdHandler = this.getProdukByIdHandler.bind(this);
    this.putProdukHandler = this.putProdukHandler.bind(this);
    this.deleteProdukHandler = this.deleteProdukHandler.bind(this);
  }

  async postProdukHandler(request, h) {
    try {
      this._validator.validatePostProdukPayload(request.payload);

      const { perusahaanId } = request.auth.credentials;
      const {
        kode, nama, deskripsi, harga, biaya, stock, kategori_id: kategoriId,
      } = request.payload;

      const produkId = await this._service.addProduk({
        kode, nama, deskripsi, harga, biaya, stock, kategoriId, perusahaanId,
      });

      const response = h.response({
        status: 'success',
        message: 'Produk berhasil ditambahkan',
        data: {
          produkId,
          nama,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      return error;
    }
  }

  async getProdukHandler(request) {
    try {
      const { perusahaanId } = request.auth.credentials;
      const {
        page, q, withStock, withKategori, kategoriId,
      } = request.query;
      const { produk, meta } = await this._service.getProduk(perusahaanId, {
        page, q, withStock, withKategori, kategoriId,
      });

      return {
        status: 'success',
        data: {
          produk,
          meta,
        },
      };
    } catch (error) {
      return error;
    }
  }

  async getProdukByIdHandler(request) {
    try {
      const { perusahaanId } = request.auth.credentials;
      const { id: produkId } = request.params;

      const produk = await this._service.getProdukById({ produkId, perusahaanId });

      return {
        status: 'success',
        data: {
          produk,
        },
      };
    } catch (error) {
      return error;
    }
  }

  async putProdukHandler(request) {
    try {
      this._validator.validatePutProdukPayload(request.payload);

      const { id: produkId } = request.params;
      const {
        kode, nama, deskripsi, harga, biaya, stock, kategori_id: kategoriId,
      } = request.payload;

      await this._service.updateProdukById(produkId, {
        kode, nama, deskripsi, harga, biaya, stock, kategoriId,
      });

      return {
        status: 'success',
        message: 'Produk berhasil diupdate',
        data: {
          nama,
        },
      };
    } catch (error) {
      return error;
    }
  }

  async deleteProdukHandler(request) {
    try {
      const { id: produkId } = request.params;

      await this._service.deleteProdukById(produkId);

      return {
        status: 'success',
        message: 'Produk berhasil dihapus',
      };
    } catch (error) {
      return error;
    }
  }
}

module.exports = ProdukHandler;
