/* eslint-disable camelcase */

exports.up = (pgm) => {
    // penjualan
    pgm.createTable('penjualan', {
      id: {
        type: 'uuid',
        primaryKey: true,
      },
      kantor_id: {
        type: 'uuid',
        notNull: true,
      },
      date: {
        type: 'datetime',
        notNull: true,
      },
      invoice: {
        type: 'varchar(255)',
        notNull: true,
      },
      deskripsi: {
        type: 'text',
        notNull: false,
      },
      jumlah: {
        type: 'numeric(16,2)',
        notNull: false,
      },
      diskon: {
        type: 'numeric(16,2)',
        notNull: false,
      },
      pelanggan_id: {
        type: 'uuid',
        notNull: true,
      },
      created_by: {
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
          {
            references: 'users(id)',
            columns: 'created_by',
            onDelete: 'CASCADE',
          },
          {
            references: 'pelanggan(id)',
            columns: 'pelanggan_id',
            onDelete: 'CASCADE',
          },
        ],
      },
    });
    // items_penjualan
    pgm.createTable('items_penjualan', {
      id: {
        type: 'uuid',
        primaryKey: true,
        default: pgm.func('uuid_generate_v4()'),
      },
      penjualan_id: {
        type: 'uuid',
        notNull: true,
      },
      produk_id: {
        type: 'uuid',
        notNull: true,
      },
      quantity: {
        type: 'numeric(16,2)',
        notNull: true,
      },
      harga: {
        type: 'numeric(16,2)',
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
            references: 'penjualan(id)',
            columns: 'penjualan_id',
            onDelete: 'CASCADE',
          },
          {
            references: 'produk(id)',
            columns: 'produk_id',
            onDelete: 'CASCADE',
          },
        ],
      },
    });
    // pembelian
    pgm.createTable('pembelian', {
      id: {
        type: 'uuid',
        primaryKey: true,
      },
      kantor_id: {
        type: 'uuid',
        notNull: true,
      },
      date: {
        type: 'datetime',
        notNull: true,
      },
      invoice: {
        type: 'varchar(255)',
        notNull: true,
      },
      deskripsi: {
        type: 'text',
        notNull: false,
      },
      jumlah: {
        type: 'numeric(16,2)',
        notNull: false,
      },
      diskon: {
        type: 'numeric(16,2)',
        notNull: false,
      },
      created_by: {
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
          {
            references: 'users(id)',
            columns: 'created_by',
            onDelete: 'CASCADE',
          },
        ],
      },
    });
    // item_pembelian
    pgm.createTable('items_pembelian', {
      id: {
        type: 'uuid',
        primaryKey: true,
        default: pgm.func('uuid_generate_v4()'),
      },
      pembelian_id: {
        type: 'uuid',
        notNull: true,
      },
      produk_id: {
        type: 'uuid',
        notNull: true,
      },
      quantity: {
        type: 'numeric(16,2)',
        notNull: true,
      },
      biaya: {
        type: 'numeric(16,2)',
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
            references: 'pembelian(id)',
            columns: 'pembelian_id',
            onDelete: 'CASCADE',
          },
          {
            references: 'produk(id)',
            columns: 'produk_id',
            onDelete: 'CASCADE',
          },
        ],
      },
    });
  };
  
  exports.down = (pgm) => {
    pgm.dropTable('items_penjualan');
    pgm.dropTable('penjualan');
    pgm.dropTable('items_pembelian');
    pgm.dropTable('pembelian');
  };
  