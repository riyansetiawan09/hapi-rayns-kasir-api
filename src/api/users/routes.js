const routes = (handler) => [
  {
    method: 'POST',
    path: '/users',
    handler: handler.postUserHandler,
    options: {
      auth: 'rayns_kasir_jwt',
    },
  },
  {
    method: 'GET',
    path: '/users',
    handler: handler.getUsersHandler,
    options: {
      auth: 'rayns_kasir_jwt',
    },
  },
  {
    method: 'GET',
    path: '/users/{id}',
    handler: handler.getUserByIdHandler,
    options: {
      auth: 'rayns_kasir_jwt',
    },
  },
  {
    method: 'PUT',
    path: '/users/{id}',
    handler: handler.putUsersHandler,
    options: {
      auth: 'rayns_kasir_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/users/{id}',
    handler: handler.deleteUsersHandler,
    options: {
      auth: 'rayns_kasir_jwt',
    },
  },
];

module.exports = routes;
