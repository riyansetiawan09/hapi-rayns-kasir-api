const { Pool } = require('pg');
const uuid = require('uuid-random');
const NotFoundError = require('../../exceptions/NotFoundError');
const { validateUuid } = require('../../utils');

class UnitsService {
  constructor() {
    this._pool = new Pool();
  }

  async getUnits(perusahaanId, { page = 1, q = null, limit = 10 }) {
    const recordsQuery = await this._pool.query(`
      SELECT count(id) as total 
      FROM units 
      WHERE 
        perusahaan_id = '${perusahaanId}' 
        ${q !== null ? `AND nama ILIKE '%${q}%'` : ''}
    `);

    const { total } = recordsQuery.rows[0];

    const totalPages = Math.ceil(total / limit);
    const offsets = limit * (page - 1);

    const query = {
      text: `
        SELECT id, nama, deskripsi FROM units WHERE perusahaan_id = $1
        ${q !== null ? `AND nama ILIKE '%${q}%'` : ''}
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3
        `,
      values: [perusahaanId, limit, offsets],
    };

    const { rows } = await this._pool.query(query);

    return {
      units: rows,
      meta: {
        totalPages,
        total,
        page,
      },
    };
  }

  async getUnitById(unitId) {
    validateUuid(unitId);

    const query = {
      text: 'SELECT nama, deskripsi FROM units WHERE id = $1',
      values: [unitId],
    };

    const results = await this._pool.query(query);

    if (results.rowCount < 1) {
      throw new NotFoundError('Unit tidak ditemukan');
    }

    return results.rows[0];
  }

  async addUnit({ nama, deskripsi, perusahaanId }) {
    const id = uuid();
    const query = {
      text: 'INSERT INTO units(id, nama, deskripsi, perusahaan_id) VALUES ($1, $2, $3, $4)',
      values: [id, nama, deskripsi, perusahaanId],
    };

    await this._pool.query(query);

    return id;
  }

  async updateUnitById(unitId, { nama, deskripsi }) {
    validateUuid(unitId);

    const query = {
      text: 'UPDATE units SET nama = $1, deskripsi = $2 WHERE id = $3',
      values: [nama, deskripsi, unitId],
    };

    await this._pool.query(query);
  }

  async deleteUnitById(unitId) {
    validateUuid(unitId);

    const query = {
      text: 'DELETE FROM units WHERE id = $1',
      values: [unitId],
    };

    await this._pool.query(query);
  }
}

module.exports = UnitsService;
