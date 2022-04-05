const { Pool } = require('pg');
const uuid = require('uuid-random');
const NotFoundError = require('../../exceptions/NotFoundError');
const { validateUuid } = require('../../utils');

class KategoriService {
  constructor() {
    this._pool = new Pool();
  }

  async getKategori(perusahaanId, { page = 1, limit = 10, q = null }) {
    const recordsQuery = await this._pool.query(`
      SELECT count(id) as total 
      FROM kategori 
      WHERE 
        perusahaan_id = '${perusahaanId}' 
        ${q !== null ? `AND nama ILIKE '%${q}%'` : ''}
    `);

    const { total } = recordsQuery.rows[0];

    const totalPages = Math.ceil(total / limit);
    const offsets = limit * (page - 1);

    const query = {
      text: `
        SELECT id, nama, deskripsi 
        FROM kategori 
        WHERE perusahaan_id = $1
        ${q !== null ? `AND nama ILIKE '%${q}%'` : ''}
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3`,
      values: [perusahaanId, limit, offsets],
    };

    const { rows } = await this._pool.query(query);

    return {
      kategori: rows,
      meta: {
        totalPages,
        total,
        page,
      },
    };
  }

  async getKategoriById(kategoriId) {
    validateUuid(kategoriId);

    const query = {
      text: 'SELECT nama, deskripsi FROM kategori WHERE id = $1',
      values: [kategoriId],
    };

    const results = await this._pool.query(query);

    if (results.rowCount < 1) {
      throw new NotFoundError('Kategori tidak ditemukan');
    }

    return results.rows[0];
  }

  async addKategori({ nama, deskripsi, perusahaanId }) {
    const id = uuid();
    const query = {
      text: 'INSERT INTO kategori(id, nama, deskripsi, perusahaan_id) VALUES ($1, $2, $3, $4)',
      values: [id, nama, deskripsi, perusahaanId],
    };

    await this._pool.query(query);

    return id;
  }

  async updateKategoriById(kategoriId, { nama, deskripsi }) {
    validateUuid(kategoriId);

    const query = {
      text: 'UPDATE kategori SET nama = $1, deskripsi = $2 WHERE id = $3',
      values: [nama, deskripsi, kategoriId],
    };

    await this._pool.query(query);
  }

  async deleteKategoriById(kategoriId) {
    validateUuid(kategoriId);

    const query = {
      text: 'DELETE FROM kategori WHERE id = $1',
      values: [kategoriId],
    };

    await this._pool.query(query);
  }
}

module.exports = KategoriService;
