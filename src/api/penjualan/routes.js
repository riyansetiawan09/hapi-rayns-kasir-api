const routes = (handler) => [
  {
    method: 'POST',
    path: '/penjualan',
    handler: handler.postPenjualanHandler,
    options: {
      auth: 'rayns_kasir_jwt',
    },
  },
  {
    method: 'GET',
    path: '/penjualan',
    handler: handler.getPenjualanHandler,
    options: {
      auth: 'rayns_kasir_jwt',
    },
  },
  {
    method: 'GET',
    path: '/penjualan/{id}',
    handler: handler.getPenjualanByIdHandler,
    options: {
      auth: 'rayns_kasir_jwt',
    },
  },
];

module.exports = routes;
