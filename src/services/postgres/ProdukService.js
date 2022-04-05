const { Pool } = require('pg');
const uuid = require('uuid-random');
const { validateUuid } = require('../../utils');
const NotFoundError = require('../../exceptions/NotFoundError');
const InvariantError = require('../../exceptions/InvariantError');

class ProdukService {
  constructor() {
    this._pool = new Pool();
  }

  async getProduk(perusahaanId, {
    page = 1, q = null, withStock = false, withKategori = false, kategoriId, limit = 10,
  }) {
    const recordsQuery = await this._pool.query(`
      SELECT count(id) as total 
      FROM produk 
      WHERE 
        perusahaan_id = '${perusahaanId}' 
        ${q ? `AND (nama ILIKE '%${q}%' OR kode ILIKE '%${q}%')` : ''}
    `);

    const { total } = recordsQuery.rows[0];
    const totalPages = Math.ceil(total / limit);
    const offsets = limit * (page - 1);
    const query = {
      text: `SELECT 
              produk.id, produk.kode, produk.nama, produk.deskripsi, harga, biaya
              ${withStock === 'true' ? ', stock, penjualan, pembelian' : ''}
              ${withKategori === 'true' ? ', kategori.nama as nama_kategori' : ''}
            FROM produk
            ${withStock === 'true' ? 'LEFT JOIN stocks ON stocks.produk_id = produk.id' : ''}
            ${withKategori === 'true' ? 'LEFT JOIN kategori ON kategori.id = produk.kategori_id' : ''}
            WHERE produk.perusahaan_id = $1
            ${kategoriId ? `AND kategori.id = '${kategoriId}'` : ''}
            ${q ? `AND (produk.nama ILIKE '%${q}%' OR produk.kode ILIKE '%${q}%')` : ''}
            ORDER BY produk.created_at DESC
            LIMIT $2 OFFSET $3`,
      values: [perusahaanId, limit, offsets],
    };

    const { rows } = await this._pool.query(query);

    return {
      produk: rows,
      meta: {
        totalPages,
        total,
        page,
      },
    };
  }

  async getProdukById({ produkId, perusahaanId }) {
    validateUuid(produkId);

    const query = {
      text: `SELECT 
              produk.kode, produk.nama, produk.deskripsi, harga, biaya, biaya_average, 
              kategori.nama as nama_kategori,
              kategori.id as kategori_id,
              stocks.stock
            FROM produk
            LEFT JOIN stocks ON stocks.produk_id = produk.id
            LEFT JOIN kategori ON kategori.id = produk.kategori_id
            WHERE produk.id = $1 AND produk.perusahaan_id = $2`,
      values: [produkId, perusahaanId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount < 1) {
      throw new NotFoundError('Produk tidak ditemukan');
    }

    return result.rows[0];
  }

  async addProduk({
    kode, nama, deskripsi, harga, biaya, stock, kategoriId, perusahaanId,
  }) {
    const produkId = uuid();
    const stockId = uuid();

    const produkQuery = {
      text: `INSERT INTO produk(id, kode, nama, deskripsi, harga, biaya, kategori_id, perusahaan_id, unit_id)
            VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8, (SELECT id FROM units WHERE perusahaan_id = $8 LIMIT 1))`,
      values: [produkId, kode, nama, deskripsi, harga, biaya, kategoriId, perusahaanId],
    };

    const stockQuery = {
      text: `INSERT INTO 
              stocks(id, produk_id, stock, gudang_id, penjualan, pembelian)
            VALUES 
              ($1, $2, $3, (
                SELECT id FROM gudang WHERE kantor_id = 
                  (SELECT id FROM kantor WHERE perusahaan_id = $4 LIMIT 1) 
                LIMIT 1),
              0, 0)`,
      values: [stockId, produkId, stock, perusahaanId],
    };

    const client = await this._pool.connect();

    try {
      await client.query('BEGIN');
      await client.query(produkQuery);
      await client.query(stockQuery);
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw new InvariantError(`Produk gagal ditambahkan: ${err.message}`);
    } finally {
      client.release();
    }

    return produkId;
  }

  async updateProdukById(produkId, {
    kode, nama, deskripsi, harga, biaya, stock, kategoriId,
  }) {
    validateUuid(produkId);

    const produkQuery = {
      text: `UPDATE produk SET 
              kode = $1, nama = $2, deskripsi = $3, harga = $4, 
              biaya = $5, kategori_id = $6
            WHERE id = $7`,
      values: [kode, nama, deskripsi, harga, biaya, kategoriId, produkId],
    };

    const stockQuery = {
      text: 'UPDATE stocks SET stock = $1 WHERE produk_id = $2',
      values: [stock, produkId],
    };

    try {
      await this._pool.query('BEGIN');
      await this._pool.query(produkQuery);
      await this._pool.query(stockQuery);
      await this._pool.query('COMMIT');
    } catch (err) {
      await this._pool.query('ROLLBACK');
      throw new InvariantError('Produk gagal diubah');
    }
  }

  async deleteProdukById(produkId) {
    validateUuid(produkId);
    const query = {
      text: 'DELETE FROM produk WHERE id = $1',
      values: [produkId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount < 1) {
      throw new NotFoundError('Produk tidak ditemukan');
    }
  }
}

module.exports = ProdukService;
