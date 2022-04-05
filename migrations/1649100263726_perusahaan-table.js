/* eslint-disable camelcase */
const bcrypt = require('bcrypt');

exports.up = async (pgm) => {
  pgm.sql('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

  pgm.createTable('perusahaan', {
    id: {
      type: 'uuid',
      primaryKey: true,
    },
    nama: {
      type: 'varchar(255)',
      notNull: true,
    },
    deskripsi: {
      type: 'text',
      notNull: false,
    },
    alamat: {
      type: 'text',
      notNull: false,
    },
    no_telepon: {
      type: 'varchar(16)',
      notNull: false,
    },
    email: {
      type: 'varchar(255)',
      notNull: false,
    },
    created_at: {
      type: 'timestamp without time zone',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp without time zone',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
  // kantor
  pgm.createTable('kantor', {
    id: {
      type: 'uuid',
      primaryKey: true,
    },
    nama: {
      type: 'varchar(255)',
      notNull: true,
    },
    deskripsi: {
      type: 'text',
      notNull: false,
    },
    alamat: {
      type: 'text',
      notNull: false,
    },
    no_telepon: {
      type: 'varchar(16)',
      notNull: false,
    },
    email: {
      type: 'varchar(255)',
      notNull: false,
    },
    perusahaan_id: {
      type: 'uuid',
      notNull: true,
    },
    created_at: {
      type: 'timestamp without time zone',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp without time zone',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  }, {
    constraints: {
      foreignKeys: [
        {
          references: 'perusahaan(id)',
          columns: 'perusahaan_id',
          onDelete: 'CASCADE',
        },
      ],
    },
  });
  // gudang
  pgm.createTable('gudang', {
    id: {
      type: 'uuid',
      primaryKey: true,
    },
    nama: {
      type: 'varchar(255)',
      notNull: true,
    },
    deskripsi: {
      type: 'text',
      notNull: false,
    },
    alamat: {
      type: 'text',
      notNull: false,
    },
    no_telepon: {
      type: 'varchar(16)',
      notNull: false,
    },
    kantor_id: {
      type: 'uuid',
      notNull: true,
    },
    created_at: {
      type: 'timestamp without time zone',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp without time zone',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  }, {
    constraints: {
      foreignKeys: [
        {
          references: 'kantor(id)',
          columns: 'kantor_id',
          onDelete: 'CASCADE',
        },
      ],
    },
  });
  // user
  pgm.createTable('users', {
    id: {
      type: 'uuid',
      primaryKey: true,
    },
    nama: {
      type: 'varchar(255)',
      notNull: true,
    },
    email: {
      type: 'varchar(255)',
      notNull: false,
    },
    password: {
      type: 'varchar(255)',
      notNull: false,
    },
    role: {
      type: 'varchar(16)',
      notNull: false,
    },
    perusahaan_id: {
      type: 'uuid',
      notNull: true,
    },
    created_at: {
      type: 'timestamp without time zone',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp without time zone',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  }, {
    constraints: {
      foreignKeys: [
        {
          references: 'perusahaan(id)',
          columns: 'perusahaan_id',
          onDelete: 'CASCADE',
        },
      ],
    },
  });
  // create default perusahaan, kantor, gudang, users
  pgm.sql("INSERT INTO perusahaan VALUES (uuid_generate_v4(), 'Toko 1', '', 'Jakarta', '088294321330', 'toko1@toko.com')");
  pgm.sql("INSERT INTO kantor VALUES (uuid_generate_v4(), 'Toko 1', '', 'Jakarta', '088294321330', 'toko1@toko.com', (SELECT id FROM perusahaan LIMIT 1))");
  pgm.sql("INSERT INTO gudang VALUES  (uuid_generate_v4(), 'Toko 1', '', 'Jakarta', '088294321330', (SELECT id FROM kantor LIMIT 1))");

  const password = await bcrypt.hash('password', 10);

  pgm.sql(`INSERT INTO users VALUES (uuid_generate_v4(), 'Admin', 'admin@mail.com', '${password}', 'admin', (SELECT id FROM perusahaan LIMIT 1))`);
};

exports.down = (pgm) => {
  pgm.dropTable('users');
  pgm.dropTable('gudang');
  pgm.dropTable('kantor');
  pgm.dropTable('perusahaan');
};
