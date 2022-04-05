const routes = (handler) => [
  {
    method: 'GET',
    path: '/dashboard',
    handler: handler.getDashboardHandler,
    options: {
      auth: 'rayns_kasir_jwt',
    },
  },
];

module.exports = routes;
