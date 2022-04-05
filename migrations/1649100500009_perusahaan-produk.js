/* eslint-disable camelcase */
/* eslint-disable camelcase */

exports.up = (pgm) => {
    // units
    pgm.createTable('units', {
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
    // kategori
    pgm.createTable('kategori', {
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
    // produk
    pgm.createTable('produk', {
      id: {
        type: 'uuid',
        primaryKey: true,
      },
      kode: {
        type: 'varchar(255)',
        notNull: true,
      },
      nama: {
        type: 'varchar(255)',
        notNull: true,
      },
      deskripsi: {
        type: 'text',
        notNull: false,
      },
      harga: {
        type: 'numeric(16,2)',
        notNull: false,
      },
      biaya: {
        type: 'numeric(16,2)',
        notNull: false,
      },
      biaya_average: {
        type: 'numeric(16,2)',
        notNull: false,
      },
      perusahaan_id: {
        type: 'uuid',
        notNull: true,
      },
      kategori_id: {
        type: 'uuid',
        notNull: true,
      },
      unit_id: {
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
          {
            references: 'units(id)',
            columns: 'unit_id',
            onDelete: 'CASCADE',
          },
          {
            references: 'kategori(id)',
            columns: 'kategori_id',
            onDelete: 'CASCADE',
          },
        ],
      },
    });
    // stocks
    pgm.createTable('stocks', {
      id: {
        type: 'uuid',
        primaryKey: true,
      },
      produk_id: {
        type: 'uuid',
        notNull: true,
      },
      gudang_id: {
        type: 'uuid',
        notNull: true,
      },
      stock: {
        type: 'numeric(16,2)',
        notNull: false,
      },
      penjualan: {
        type: 'numeric(16,2)',
        notNull: false,
      },
      pembelian: {
        type: 'numeric(16,2)',
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
    }, {
      constraints: {
        foreignKeys: [
          {
            references: 'produk(id)',
            columns: 'produk_id',
            onDelete: 'CASCADE',
          },
          {
            references: 'gudang(id)',
            columns: 'gudang_id',
            onDelete: 'CASCADE',
          },
        ],
      },
    });
    // harga
    pgm.createTable('harga', {
      id: {
        type: 'uuid',
        primaryKey: true,
      },
      produk_id: {
        type: 'uuid',
        notNull: true,
      },
      kantor_id: {
        type: 'uuid',
        notNull: true,
      },
      harga: {
        type: 'numeric(16,2)',
        notNull: false,
      },
      biaya: {
        type: 'numeric(16,2)',
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
    }, {
      constraints: {
        foreignKeys: [
          {
            references: 'produk(id)',
            columns: 'produk_id',
            onDelete: 'CASCADE',
          },
          {
            references: 'kantor(id)',
            columns: 'kantor_id',
            onDelete: 'CASCADE',
          },
        ],
      },
    });
  
    pgm.createTable('pelanggan', {
      id: {
        type: 'uuid',
        primaryKey: true,
      },
      nama: {
        type: 'varchar(255)',
        notNull: true,
      },
      no_telepon: {
        type: 'varchar(16)',
        notNull: false,
      },
      alamat: {
        type: 'text',
        notNull: false,
      },
      deskripsi: {
        type: 'text',
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
  };
  
  exports.down = (pgm) => {
    pgm.dropTable('pelanggan');
    pgm.dropTable('harga');
    pgm.dropTable('stocks');
    pgm.dropTable('produk');
    pgm.dropTable('kategori');
    pgm.dropTable('units');
  };
  