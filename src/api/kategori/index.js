const KategoriHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'kategori',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const kategoriHandler = new KategoriHandler(service, validator);
    server.route(routes(kategoriHandler));
  },
};
