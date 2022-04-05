const routes = (handler) => [
  {
    method: 'POST',
    path: '/pelanggan',
    handler: handler.postPelangganHandler,
    options: {
      auth: 'rayns_kasir_jwt',
    },
  },
  {
    method: 'GET',
    path: '/pelanggan',
    handler: handler.getPelangganHandler,
    options: {
      auth: 'rayns_kasir_jwt',
    },
  },
  {
    method: 'GET',
    path: '/pelanggan/{id}',
    handler: handler.getPelangganByIdHandler,
    options: {
      auth: 'rayns_kasir_jwt',
    },
  },
  {
    method: 'PUT',
    path: '/pelanggan/{id}',
    handler: handler.putPelangganByIdHandler,
    options: {
      auth: 'rayns_kasir_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/pelanggan/{id}',
    handler: handler.deletePelangganByIdHandler,
    options: {
      auth: 'rayns_kasir_jwt',
    },
  },
];

module.exports = routes;
