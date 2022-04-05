const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const uuid = require('uuid-random');
const InvariantError = require('../../exceptions/InvariantError');

class RegistrationService {
  constructor(userService) {
    this._pool = new Pool();
    this._userService = userService;
  }

  async registerStore({ nama, email, password }) {
    await this._userService.verifyNewEmail({ email });

    const perusahaanId = uuid();
    const kantorId = uuid();
    const gudangId = uuid();
    const unitId = uuid();
    const hashedPassword = await bcrypt.hash(password, 12);

    const createPerusahaanQuery = {
      text: 'INSERT INTO perusahaan(id, nama) VALUES ($1, $2)',
      values: [perusahaanId, nama],
    };

    const createKantorQuery = {
      text: 'INSERT INTO kantor(id, nama, perusahaan_id) VALUES ($1, $2, $3)',
      values: [kantorId, `kantor-${nama}`, perusahaanId],
    };

    const createGudangQuery = {
      text: 'INSERT INTO gudang(id, nama, kantor_id) VALUES ($1, $2, $3)',
      values: [gudangId, `gudang-${nama}`, kantorId],
    };

    const createUserQuery = {
      text: 'INSERT INTO users(id, nama, email, password, role, perusahaan_id) VALUES ((select uuid_generate_v4()), $1, $2, $3, $4, $5)',
      values: [nama, email, hashedPassword, 'admin', perusahaanId],
    };

    const createUnitQuery = {
      text: 'INSERT INTO units(id, nama, perusahaan_id) VALUES ($1, $2, $3)',
      values: [unitId, 'Buah', perusahaanId],
    };

    const createKategoriQuery = {
      text: 'INSERT INTO kategori(id, nama, perusahaan_id) VALUES ((select uuid_generate_v4()), $1, $2)',
      values: ['Umum', perusahaanId]
    };

    const createPelangganQuery = {
      text: 'INSERT INTO pelanggan(id, nama, no_telepon, alamat, deskripsi, perusahaan_id) VALUES ((select uuid_generate_v4()), $1, $2, $3, $4, $5)',
      values: ['Pelanggan Umum', '', '-', '-', perusahaanId]
    };

    const client = await this._pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(createPerusahaanQuery);
      await client.query(createKantorQuery);
      await client.query(createGudangQuery);
      await client.query(createUserQuery);
      await client.query(createUnitQuery);
      await client.query(createKategoriQuery);
      await client.query(createPelangganQuery);
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw new InvariantError(`Gagal melakukan registrasi: ${err.message}`);
    } finally {
      client.release();
    }
  }
}

module.exports = RegistrationService;
