const { Pool } = require('pg');

class GeneralService {
  constructor() {
    this._pool = new Pool();
  }

  async dashboardSummary(perusahaanId) {
    const penjualanHariIniCount = await this._pool.query(
      `SELECT COUNT(id) as penjualan_count FROM penjualan WHERE kantor_id = (SELECT id FROM kantor WHERE perusahaan_id = '${perusahaanId}' LIMIT 1) AND date::DATE = CURRENT_DATE`,
    );

    const pembelianHariIniCount = await this._pool.query(
      `SELECT COUNT(id) as pembelian_count FROM pembelian WHERE kantor_id = (SELECT id FROM kantor WHERE perusahaan_id = '${perusahaanId}' LIMIT 1) AND date::DATE = CURRENT_DATE`,
    );

    const penjualanKemarinCount = await this._pool.query(
      `SELECT COUNT(id) as penjualan_count FROM penjualan WHERE kantor_id = (SELECT id FROM kantor WHERE perusahaan_id = '${perusahaanId}' LIMIT 1) AND date::DATE = CURRENT_DATE - 1`,
    );

    const pembelianKemarinCount = await this._pool.query(
      `SELECT COUNT(id) as pembelian_count FROM pembelian WHERE kantor_id = (SELECT id FROM kantor WHERE perusahaan_id = '${perusahaanId}' LIMIT 1) AND date::DATE = CURRENT_DATE - 1`,
    );

    const totalPenjualan = await this._pool.query(`
      SELECT SUM(jumlah) as total_penjualan FROM penjualan WHERE kantor_id = (SELECT id FROM kantor WHERE perusahaan_id = '${perusahaanId}' LIMIT 1)
    `);

    const totalPembelian = await this._pool.query(`
      SELECT SUM(jumlah) as total_pembelian FROM pembelian WHERE kantor_id = (SELECT id FROM kantor WHERE perusahaan_id = '${perusahaanId}' LIMIT 1)
    `);

    const graphPenjualan = await this._pool.query(
      `SELECT COUNT(date), date::DATE 
      FROM penjualan
      WHERE kantor_id = (SELECT id FROM kantor WHERE perusahaan_id = '${perusahaanId}' LIMIT 1) AND date::DATE BETWEEN CURRENT_DATE - 7 AND CURRENT_DATE
      GROUP BY date::DATE`,
    );

    const graphPembelian = await this._pool.query(
      `SELECT COUNT(date), date::DATE 
      FROM pembelian
      WHERE kantor_id = (SELECT id FROM kantor WHERE perusahaan_id = '${perusahaanId}' LIMIT 1) AND date::DATE BETWEEN CURRENT_DATE - 7 AND CURRENT_DATE
      GROUP BY date::DATE `,
    );

    const grownPenjualan = (+penjualanKemarinCount.rows[0].penjualan_count - +penjualanHariIniCount.rows[0].penjualan_count)
      / +penjualanKemarinCount.rows[0].penjualan_count;
    const grownPembelian = (+pembelianKemarinCount.rows[0].pembelian_count
      - +pembelianHariIniCount.rows[0].pembelian_count)
      / +pembelianKemarinCount.rows[0].pembelian_count;

    return {
      penjualanCount: penjualanHariIniCount.rows[0].penjualan_count,
      pembelianCount: pembelianHariIniCount.rows[0].pembelian_count,
      penjualanKemarinCount: penjualanKemarinCount.rows[0].penjualan_count,
      pembelianKemarinCount: pembelianKemarinCount.rows[0].pembelian_count,
      grownPenjualan,
      grownPembelian,
      graphPenjualan: graphPenjualan.rows,
      graphPembelian: graphPembelian.rows,
      totalPenjualan: totalPenjualan.rows[0].total_penjualan,
      totalPembelian: totalPembelian.rows[0].total_pembelian,
    };
  }
}

module.exports = GeneralService;
