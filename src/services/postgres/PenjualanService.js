const { Pool } = require('pg');
const uuid = require('uuid-random');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { validateUuid } = require('../../utils');

class PenjualanService {
  constructor() {
    this._pool = new Pool();
  }

  async createTransaksi({
    date, invoice, deskripsi, jumlah, diskon, items, userId, kantorId, pelangganId,
  }) {
    // check stock
    const stocksQuery = await this._pool.query(`
      SELECT produk_id, stock, penjualan FROM stocks 
      WHERE produk_id IN (${items.map((i) => `'${i.produkId}'`).join()})`);
    const stocks = stocksQuery.rows;
    const itemsWithStock = items.map((item) => ({
      ...item,
      stock: stocks.find((sp) => sp.produk_id === item.produkId).stock,
      penjualan: stocks.find((sp) => sp.produk_id === item.produkId).penjualan,
    }));
    const checkStock = itemsWithStock
      .map((iws) => +iws.stock - +iws.quantity).every((i) => i >= 0);
    if (!checkStock) {
      throw new InvariantError('Transaksi gagal: stock tidak cukup');
    }

    const client = await this._pool.connect();
    try {
      await client.query('BEGIN'); // transaksi

      const id = uuid();
      const penjualanQuery = {
        text: `INSERT INTO 
                penjualan(id, date, invoice, deskripsi, jumlah, diskon, created_by, kantor_id, pelanggan_id)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
        values: [id, date, invoice, deskripsi, jumlah, diskon, userId, kantorId, pelangganId],
      };

      const penjualan = await client.query(penjualanQuery);
      const penjualanId = penjualan.rows[0].id;

      await itemsWithStock.map(async (item) => {
        await client.query(`UPDATE stocks SET stock = '${+item.stock - +item.quantity}', penjualan = '${+item.penjualan + +item.quantity}' WHERE produk_id = '${item.produkId}'`);

        const itemQuery = {
          text: `INSERT INTO items_penjualan(penjualan_id, produk_id, quantity, harga) VALUES ('${penjualanId}', '${item.produkId}', '${item.quantity}', '${item.harga}')`,
        };

        await client.query(itemQuery);
      });

      await client.query('COMMIT');

      return penjualanId;
    } catch (error) {
      await client.query('ROLLBACK');
      throw new InvariantError(`Transaksi gagal: ${error.message}`);
    } finally {
      client.release();
    }
  }

  async getPenjualan(perusahaanId, {
    startDate, endDate, page = 1, q = null, pelangganId, limit = 20,
  }) {
    const recordsQuery = await this._pool.query(`
      SELECT count(penjualan.id) as total 
      FROM penjualan 
      ${pelangganId ? 'LEFT JOIN pelanggan ON pelanggan.id = penjualan.pelanggan_id' : ''}
      WHERE 
        penjualan.kantor_id = (SELECT id FROM kantor WHERE perusahaan_id = '${perusahaanId}' LIMIT 1)
      ${q ? `AND invoice ILIKE '%${q}%'` : ''}
      ${pelangganId ? `AND pelanggan_id = '${pelangganId}'` : ''}
      AND date::DATE BETWEEN '${startDate}' AND '${endDate}'
    `);

    const { total } = recordsQuery.rows[0];

    const totalPages = Math.ceil(total / limit);
    const offsets = limit * (page - 1);

    const query = {
      text: `SELECT 
              penjualan.id, invoice, date, jumlah, 
              kantor.nama as nama_kantor, 
              users.nama as casier,
              pelanggan.nama as nama_pelanggan
            FROM penjualan 
            LEFT JOIN kantor ON kantor.id = penjualan.kantor_id
            LEFT JOIN users ON users.id = penjualan.created_by
            LEFT JOIN pelanggan ON pelanggan.id = penjualan.pelanggan_id
            WHERE 
              penjualan.kantor_id = (SELECT id FROM kantor WHERE perusahaan_id = $1 LIMIT 1)
            ${q ? `AND invoice ILIKE '%${q}%'` : ''}
            ${pelangganId ? `AND pelanggan_id = '${pelangganId}'` : ''}
            AND date::DATE BETWEEN $2 AND $3
            ORDER BY penjualan.created_at DESC
            LIMIT $4 OFFSET $5
            `,
      values: [perusahaanId, startDate, endDate, limit, offsets],
    };

    const { rows } = await this._pool.query(query);

    return {
      penjualan: rows,
      meta: {
        page,
        total,
        totalPages,
      },
    };
  }

  async getPenjualanById(penjualanId) {
    validateUuid(penjualanId);

    const query = {
      text: `SELECT 
                date, invoice, penjualan.deskripsi, jumlah, diskon, 
                users.nama as casier, 
                kantor.nama as nama_kantor,
                pelanggan.id as pelanggan_id, pelanggan.nama as nama_pelanggan
              FROM penjualan
              LEFT JOIN kantor ON kantor.id = penjualan.kantor_id
              LEFT JOIN users ON users.id = penjualan.created_by
              LEFT JOIN pelanggan ON pelanggan.id = penjualan.pelanggan_id
              WHERE penjualan.id = $1`,
      values: [penjualanId],
    };

    const results = await this._pool.query(query);

    if (results.rowCount < 1) {
      throw new NotFoundError('Transaksi tidak ditemukan');
    }

    const itemsQuery = {
      text: `SELECT 
              produk.id, produk.kode, produk.nama, quantity, items_penjualan.harga
            FROM items_penjualan
            LEFT JOIN produk ON produk.id = items_penjualan.produk_id
            WHERE penjualan_id = $1`,
      values: [penjualanId],
    };

    const items = await this._pool.query(itemsQuery);

    return {
      ...results.rows[0],
      items: items.rows,
    };
  }
}

module.exports = PenjualanService;
