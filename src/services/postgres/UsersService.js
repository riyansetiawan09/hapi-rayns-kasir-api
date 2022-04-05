const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const uuid = require('uuid-random');
const AuthenticationError = require('../../exceptions/AuthenticationError');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { validateUuid } = require('../../utils');

class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  async verifyUserCredential(email, password) {
    const query = {
      text: 'SELECT id, perusahaan_id, password FROM users WHERE email = $1',
      values: [email],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    const { id, perusahaan_id: perusahaanId, password: hashedPassword } = result.rows[0];

    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }
    return { id, perusahaanId };
  }

  async verifyNewEmail({ email }) {
    const query = {
      text: 'SELECT id FROM users WHERE email = $1',
      values: [email],
    };

    const result = await this._pool.query(query);

    if (result.rowCount >= 1) {
      throw new InvariantError('Email sudah digunakan');
    }
  }

  async addUser({
    nama, email, password, perusahaanId,
  }) {
    await this.verifyNewEmail({ email });

    const id = uuid();
    const hashedPassword = await bcrypt.hash(password, 12);

    const query = {
      text: 'INSERT INTO users(id, nama, email, password, perusahaan_id, role) VALUES ($1, $2, $3, $4, $5, $6)',
      values: [id, nama, email, hashedPassword, perusahaanId, 'kasir'],
    };

    await this._pool.query(query);

    return id;
  }

  async getUsers(perusahaanId, { page = 1, q = null, limit = 10 }) {
    const recordsQuery = await this._pool.query(`
      SELECT count(id) as total 
      FROM users 
      WHERE 
        perusahaan_id = '${perusahaanId}' 
        ${q !== null ? `AND nama ILIKE '%${q}%'` : ''}
    `);

    const { total } = recordsQuery.rows[0];

    const totalPages = Math.ceil(total / limit);
    const offsets = limit * (page - 1);

    const query = {
      text: `
        SELECT id, nama, email, role FROM users WHERE perusahaan_id = $1
        ${q !== null ? `AND nama ILIKE '%${q}%'` : ''}
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3`,
      values: [perusahaanId, limit, offsets],
    };

    const { rows } = await this._pool.query(query);

    return {
      users: rows,
      meta: {
        totalPages,
        total,
        page,
      },
    };
  }

  async getUserById({ userId, perusahaanId }) {
    validateUuid(userId);

    const query = {
      text: 'SELECT id, nama, email, role FROM users WHERE id = $1 AND perusahaan_id = $2',
      values: [userId, perusahaanId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount < 1) {
      throw new NotFoundError('User tidak ditemukan');
    }

    return result.rows[0];
  }

  async getMe(userId) {
    validateUuid(userId);

    const query = {
      text: `SELECT 
              users.id, users.nama, role, users.email, 
              kantor.id as kantorId, 
              perusahaan.id as perusahaanId, perusahaan.nama as nama_perusahaan 
            FROM users 
            LEFT JOIN perusahaan ON perusahaan.id = users.perusahaan_id
            LEFT JOIN kantor ON perusahaan.id = kantor.perusahaan_id
            WHERE users.id = $1`,
      values: [userId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount < 1) {
      throw new NotFoundError('User tidak ditemukan');
    }

    return result.rows[0];
  }

  async updateUserById(userId, { nama, email, password }) {
    validateUuid(userId);

    let hashedPassword = '';
    if (password) {
      hashedPassword = await bcrypt.hash(password, 12);
    }
    const updatedAt = new Date().toISOString();
    const query = {
      text: `UPDATE users SET nama = $1, email = $2, updated_at = $3 ${password ? `, password = '${hashedPassword}'` : ''} WHERE id = $4`,
      values: [nama, email, updatedAt, userId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount < 1) {
      throw new NotFoundError('User tidak ditemukan');
    }
  }

  async deleteUserById(userId) {
    validateUuid(userId);

    const query = {
      text: 'DELETE FROM users WHERE id = $1',
      values: [userId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount < 1) {
      throw new NotFoundError('User tidak ditemukan');
    }
  }
}

module.exports = UsersService;
