const routes = (handler) => [
  {
    method: 'POST',
    path: '/pembelian',
    handler: handler.postPembelianHandler,
    options: {
      auth: 'rayns_kasir_jwt',
    },
  },
  {
    method: 'GET',
    path: '/pembelian',
    handler: handler.getPembelianHandler,
    options: {
      auth: 'rayns_kasir_jwt',
    },
  },
  {
    method: 'GET',
    path: '/pembelian/{id}',
    handler: handler.getPembelianByIdHandler,
    options: {
      auth: 'rayns_kasir_jwt',
    },
  },
];

module.exports = routes;
