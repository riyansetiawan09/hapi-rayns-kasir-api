const ProdukHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'produk',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const produkHandler = new ProdukHandler(service, validator);
    server.route(routes(produkHandler));
  },
};
