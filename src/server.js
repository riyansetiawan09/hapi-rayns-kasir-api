require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

const ClientError = require('./exceptions/ClientError');

// authentications
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');

// users
const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');

// registrasi
const registrations = require('./api/registrations');
const RegistrationsService = require('./services/postgres/RegistrationService');
const RegistrationsValidator = require('./validator/registration');

// unti
const units = require('./api/units');
const UnitsService = require('./services/postgres/UnitsService');

// Kategori
const kategori = require('./api/kategori');
const KategoriService = require('./services/postgres/KategoriService');
const KategoriValidator = require('./validator/kategori');

// pelanggan
const pelanggan = require('./api/pelanggan');
const PelangganService = require('./services/postgres/PelangganService');
const PelangganValidator = require('./validator/pelanggan');

// produk
const produk = require('./api/produk');
const ProdukService = require('./services/postgres/ProdukService');
const ProdukValidator = require('./validator/produk');

// penjualan
const penjualan = require('./api/penjualan');
const PenjualanService = require('./services/postgres/PenjualanService');
const PenjualanValidator = require('./validator/penjualan');

// pembelian
const pembelian = require('./api/pembelian');
const PembelianService = require('./services/postgres/PembelianService');
const PembelianValidator = require('./validator/pembelian');

// dashboard
const general = require('./api/general');
const GeneralService = require('./services/postgres/GeneralService');

const init = async () => {
  // instances
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const registrationsService = new RegistrationsService(usersService);
  const unitsService = new UnitsService();
  const kategoriService = new KategoriService();
  const pelangganService = new PelangganService();
  const produkService = new ProdukService();
  const penjualanService = new PenjualanService();
  const pembelianService = new PembelianService();
  const generalService = new GeneralService();

  // server
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // register plugin
  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  // jwt
  server.auth.strategy('rayns_kasir_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
        perusahaanId: artifacts.decoded.payload.perusahaanId,
      },
    }),
  });

  // route
  server.route([
    {
      method: 'GET',
      path: '/',
      handler: () => ({
        data: {
          status: 'Ok!',
          name: 'Rayns Kasir Api',
          version: '1.0.0',
        },
      }),
    },
    {
      method: '*',
      path: '/{p*}', // catch-all path
      handler: (request, h) => {
        const response = h.response({
          status: '404',
          message: 'Not Found',
        });
        response.code(404);
        return response;
      },
    },
  ]);

  // catch error response
  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }
    if (response instanceof Error) {
      console.log(response);
    }

    return response.continue || response;
  });

  // register plugin -> routes
  await server.register([
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: registrations,
      options: {
        service: registrationsService,
        validator: RegistrationsValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: units,
      options: {
        service: unitsService,
      },
    },
    {
      plugin: pelanggan,
      options: {
        service: pelangganService,
        validator: PelangganValidator,
      },
    },
    {
      plugin: produk,
      options: {
        service: produkService,
        validator: ProdukValidator,
      },
    },
    {
      plugin: kategori,
      options: {
        service: kategoriService,
        validator: KategoriValidator,
      },
    },
    {
      plugin: penjualan,
      options: {
        service: penjualanService,
        validator: PenjualanValidator,
      },
    },
    {
      plugin: pembelian,
      options: {
        service: pembelianService,
        validator: PembelianValidator,
      },
    },
    {
      plugin: general,
      options: {
        service: generalService,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
