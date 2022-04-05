const { Pool } = require('pg');
const uuid = require('uuid-random');
const NotFoundError = require('../../exceptions/NotFoundError');
const { validateUuid } = require('../../utils');

class PelangganService {
  constructor() {
    this._pool = new Pool();
  }

  async getPelanggan(perusahaanId, { page = 1, limit = 10, q = null }) {
    const recordsQuery = await this._pool.query(`
      SELECT count(id) as total 
      FROM pelanggan 
      WHERE 
        perusahaan_id = '${perusahaanId}' 
        ${q ? `AND (nama ILIKE '%${q}%' OR no_telepon ILIKE '%${q}%')` : ''}
    `);

    const { total } = recordsQuery.rows[0];

    const totalPages = Math.ceil(total / limit);
    const offsets = limit * (page - 1);

    const query = {
      text: `
        SELECT id, nama, no_telepon, deskripsi 
        FROM pelanggan 
        WHERE perusahaan_id = $1
        ${q ? `AND (nama ILIKE '%${q}%' OR no_telepon ILIKE '%${q}%')` : ''}
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3`,
      values: [perusahaanId, limit, offsets],
    };

    const { rows } = await this._pool.query(query);

    return {
      pelanggan: rows,
      meta: {
        totalPages,
        total,
        page,
      },
    };
  }

  async getPelangganById(pelangganId) {
    validateUuid(pelangganId);

    const query = {
      text: 'SELECT nama, no_telepon, alamat, deskripsi FROM pelanggan WHERE id = $1',
      values: [pelangganId],
    };

    const results = await this._pool.query(query);

    if (results.rowCount < 1) {
      throw new NotFoundError('Pelanggan tidak ditemukan');
    }

    return results.rows[0];
  }

  async addPelanggan({
    nama, no_telepon, alamat, deskripsi, perusahaanId,
  }) {
    const id = uuid();
    const query = {
      text: 'INSERT INTO pelanggan(id, nama, no_telepon, alamat, deskripsi, perusahaan_id) VALUES ($1, $2, $3, $4, $5, $6)',
      values: [id, nama, no_telepon, alamat, deskripsi, perusahaanId],
    };

    await this._pool.query(query);

    return id;
  }

  async updatePelangganById(pelangganId, {
    nama, no_telepon, alamat, deskripsi,
  }) {
    validateUuid(pelangganId);

    const query = {
      text: 'UPDATE pelanggan SET nama = $1, no_telepon = $2, alamat = $3, deskripsi = $4 WHERE id = $5',
      values: [nama, no_telepon, alamat, deskripsi, pelangganId],
    };

    await this._pool.query(query);
  }

  async deletePelangganById(pelangganId) {
    validateUuid(pelangganId);

    const query = {
      text: 'DELETE FROM pelanggan WHERE id = $1',
      values: [pelangganId],
    };

    await this._pool.query(query);
  }
}

module.exports = PelangganService;
