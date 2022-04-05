const Joi = require('joi');
const InvariantError = require('../../exceptions/InvariantError');

const routes = (handler) => [
  {
    method: 'POST',
    path: '/units',
    handler: handler.postUnitHandler,
    options: {
      auth: 'rayns_kasir_jwt',
      validate: {
        validator: Joi,
        payload: {
          nama: Joi.string().required(),
          deskripsi: Joi.string(),
        },
        failAction: () => {
          throw new InvariantError('nama is required, deskripsi is optional');
        },
      },
    },
  },
  {
    method: 'GET',
    path: '/units',
    handler: handler.getUnitsHandler,
    options: {
      auth: 'rayns_kasir_jwt',
      validate: {
        validator: Joi,
        query: {
          page: Joi.string().allow(''),
          q: Joi.string().allow(''),
        },
        failAction: () => {
          throw new InvariantError('params is required');
        },
      },
    },
  },
  {
    method: 'GET',
    path: '/units/{id}',
    handler: handler.getUnitByIdHandler,
    options: {
      auth: 'rayns_kasir_jwt',
    },
  },
  {
    method: 'PUT',
    path: '/units/{id}',
    handler: handler.putUnitsHandler,
    options: {
      auth: 'rayns_kasir_jwt',
      validate: {
        validator: Joi,
        payload: {
          nama: Joi.string().required(),
          deskripsi: Joi.string(),
        },
        failAction: () => {
          throw new InvariantError('nama is required, deskripsi is optional');
        },
      },
    },
  },
  {
    method: 'DELETE',
    path: '/units/{id}',
    handler: handler.deleteUnitsHandler,
    options: {
      auth: 'rayns_kasir_jwt',
    },
  },
];

module.exports = routes;
