class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.getUsersHandler = this.getUsersHandler.bind(this);
    this.postUserHandler = this.postUserHandler.bind(this);
    this.getUserByIdHandler = this.getUserByIdHandler.bind(this);
    this.putUsersHandler = this.putUsersHandler.bind(this);
    this.deleteUsersHandler = this.deleteUsersHandler.bind(this);
  }

  async getUsersHandler(request) {
    try {
      const { perusahaanId } = request.auth.credentials;
      const { page, q } = request.query;
      const { users, meta } = await this._service.getUsers(perusahaanId, { page, q });

      return {
        status: 'success',
        data: {
          users,
          meta,
        },
      };
    } catch (error) {
      return error;
    }
  }

  async postUserHandler(request, h) {
    try {
      this._validator.validatePostUserPayload(request.payload);

      const { perusahaanId } = request.auth.credentials;
      const { nama, email, password } = request.payload;

      const userId = await this._service.addUser({
        nama, email, password, perusahaanId,
      });

      const response = h.response({
        status: 'success',
        message: 'User berhasil ditambahkan',
        data: {
          userId,
          nama,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      return error;
    }
  }

  async getUserByIdHandler(request) {
    try {
      const { perusahaanId } = request.auth.credentials;
      const { id: userId } = request.params;

      const user = await this._service.getUserById({ userId, perusahaanId });

      return {
        status: 'success',
        data: {
          user,
        },
      };
    } catch (error) {
      return error;
    }
  }

  async putUsersHandler(request) {
    try {
      this._validator.validatePutUserPayload(request.payload);

      const { id: userId } = request.params;
      const { nama, email, password } = request.payload;

      await this._service.updateUserById(userId, {
        nama, email, password,
      });

      return {
        status: 'success',
        message: 'User berhasil diupdate',
        data: {
          nama,
        },
      };
    } catch (error) {
      return error;
    }
  }

  async deleteUsersHandler(request) {
    try {
      const { id: userId } = request.params;

      await this._service.deleteUserById(userId);

      return {
        status: 'success',
        message: 'User berhasil dihapus',
      };
    } catch (error) {
      return error;
    }
  }
}

module.exports = UsersHandler;
