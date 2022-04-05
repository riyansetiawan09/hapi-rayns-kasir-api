class GeneralHandler {
  constructor(service) {
    this._service = service;

    this.getDashboardHandler = this.getDashboardHandler.bind(this);
  }

  async getDashboardHandler(request) {
    try {
      const { perusahaanId } = request.auth.credentials;

      const data = await this._service.dashboardSummary(perusahaanId);

      return {
        status: 'success',
        data,
      };
    } catch (error) {
      return error;
    }
  }
}
module.exports = GeneralHandler;
