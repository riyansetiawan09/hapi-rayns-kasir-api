const routes = (handler) => [
  {
    method: 'POST',
    path: '/kategori',
    handler: handler.postKategoriHandler,
    options: {
      auth: 'rayns_kasir_jwt',
    },
  },
  {
    method: 'GET',
    path: '/kategori',
    handler: handler.getKategoriHandler,
    options: {
      auth: 'rayns_kasir_jwt',
    },
  },
  {
    method: 'GET',
    path: '/kategori/{id}',
    handler: handler.getKategoriByIdHandler,
    options: {
      auth: 'rayns_kasir_jwt',
    },
  },
  {
    method: 'PUT',
    path: '/kategori/{id}',
    handler: handler.putKategoriHandler,
    options: {
      auth: 'rayns_kasir_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/kategori/{id}',
    handler: handler.deleteKategoriHandler,
    options: {
      auth: 'rayns_kasir_jwt',
    },
  },
];

module.exports = routes;
