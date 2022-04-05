const PenjualanHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'penjualan',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const penjualanHandler = new PenjualanHandler(service, validator);
    server.route(routes(penjualanHandler));
  },
};
