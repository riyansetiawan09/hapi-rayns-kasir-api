const PembelianHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'pembelian',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const pembelianHandler = new PembelianHandler(service, validator);
    server.route(routes(pembelianHandler));
  },
};
