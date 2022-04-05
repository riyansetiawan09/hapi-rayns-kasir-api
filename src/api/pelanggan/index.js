const PelangganHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'pelanggan',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const pelangganHandler = new PelangganHandler(service, validator);
    server.route(routes(pelangganHandler));
  },
};
