const routes = (handler) => [
  {
    method: 'POST',
    path: '/produk',
    handler: handler.postProdukHandler,
    options: {
      auth: 'rayns_kasir_jwt',
    },
  },
  {
    method: 'GET',
    path: '/produk',
    handler: handler.getProdukHandler,
    options: {
      auth: 'rayns_kasir_jwt',
    },
  },
  {
    method: 'GET',
    path: '/produk/{id}',
    handler: handler.getProdukByIdHandler,
    options: {
      auth: 'rayns_kasir_jwt',
    },
  },
  {
    method: 'PUT',
    path: '/produk/{id}',
    handler: handler.putProdukHandler,
    options: {
      auth: 'rayns_kasir_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/produk/{id}',
    handler: handler.deleteProdukHandler,
    options: {
      auth: 'rayns_kasir_jwt',
    },
  },
];

module.exports = routes;
