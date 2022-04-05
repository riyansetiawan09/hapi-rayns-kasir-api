const { Pool } = require('pg');
const uuid = require('uuid-random');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { validateUuid } = require('../../utils');

class PembelianService {
  constructor() {
    this._pool = new Pool();
  }

  async createTransaksi({
    date, invoice, deskripsi, jumlah, diskon, items, userId, kantorId,
  }) {
    const client = await this._pool.connect();
    try {
      await client.query('BEGIN'); // transaksi

      const id = uuid();
      const pembelianQuery = {
        text: `INSERT INTO 
                pembelian(id, date, invoice, deskripsi, jumlah, diskon, created_by, kantor_id)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
        values: [id, date, invoice, deskripsi, jumlah, diskon, userId, kantorId],
      };

      const pembelian = await client.query(pembelianQuery);
      const pembelianId = pembelian.rows[0].id;

      await items.map(async (item) => {
        const { rows } = await client.query(`SELECT stock, pembelian FROM stocks WHERE produk_id = '${item.produkId}'`)
        await client.query(`UPDATE stocks SET stock = '${+rows[0].stock + +item.quantity}', pembelian = '${+rows[0].pembelian + +item.quantity}' WHERE produk_id = '${item.produkId}'`);

        const itemQuery = {
          text: `INSERT INTO items_pembelian(pembelian_id, produk_id, quantity, biaya) VALUES ('${pembelianId}', '${item.produkId}', '${item.quantity}', '${item.biaya}')`,
        };

        await client.query(itemQuery);
      });

      await client.query('COMMIT');

      return pembelianId;
    } catch (error) {
      await client.query('ROLLBACK');
      throw new InvariantError(`Transaksi gagal: ${error.message}`);
    } finally {
      client.release();
    }
  }

  async getPembelian(perusahaanId, { startDate, endDate, page = 1, q, limit = 20 }) {
    const recordsQuery = await this._pool.query(`
      SELECT count(pembelian.id) as total 
      FROM pembelian
      WHERE 
        pembelian.kantor_id = (SELECT id FROM kantor WHERE perusahaan_id = '${perusahaanId}' LIMIT 1)
        ${q ? `AND invoice ILIKE '%${q}%'` : ''}
      AND date::DATE BETWEEN '${startDate}' AND '${endDate}'
    `);

    const { total } = recordsQuery.rows[0];

    const totalPages = Math.ceil(total / limit);
    const offsets = limit * (page - 1);

    const query = {
      text: `SELECT 
              pembelian.id, invoice, date, jumlah,
              kantor.nama as nama_kantor,
              users.nama as creator
            FROM pembelian 
            LEFT JOIN kantor ON kantor.id = pembelian.kantor_id
            LEFT JOIN users ON users.id = pembelian.created_by
            WHERE 
              pembelian.kantor_id = (SELECT id FROM kantor WHERE perusahaan_id = $1 LIMIT 1)
              ${q ? `AND invoice ILIKE '%${q}%'` : ''}
            AND date::DATE BETWEEN $2 AND $3
            ORDER BY pembelian.created_at DESC
            LIMIT $4 OFFSET $5`,
      values: [perusahaanId, startDate, endDate, limit, offsets],
    };

    const { rows } = await this._pool.query(query);

    return {
      pembelian: rows,
      meta: {
        page,
        total,
        totalPages,
      },
    };
  }

  async getPembelianById(pembelianId) {
    validateUuid(pembelianId);

    const query = {
      text: `SELECT 
                date, invoice, pembelian.deskripsi, jumlah, diskon, users.nama as creator, kantor.nama as nama_kantor 
              FROM pembelian
              LEFT JOIN kantor ON kantor.id = pembelian.kantor_id
              LEFT JOIN users ON users.id = pembelian.created_by
              WHERE pembelian.id = $1
              ORDER BY pembelian.created_at DESC`,
      values: [pembelianId],
    };

    const results = await this._pool.query(query);

    if (results.rowCount < 1) {
      throw new NotFoundError('Transaksi tidak ditemukan');
    }

    const itemsQuery = {
      text: `SELECT 
              produk.id, produk.kode, produk.nama, quantity, items_pembelian.biaya
            FROM items_pembelian
            LEFT JOIN produk ON produk.id = items_pembelian.produk_id
            WHERE pembelian_id = $1`,
      values: [pembelianId],
    };

    const items = await this._pool.query(itemsQuery);

    return {
      ...results.rows[0],
      items: items.rows,
    };
  }
}

module.exports = PembelianService;
