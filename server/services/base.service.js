// services/base.service.js
export default class BaseService {
  constructor(client) {
    if (!client) {
      throw new Error("Axios client instance is required");
    }
    this.client = client;
  }

  async get(url, params = {}, config = {}) {
    try {
      const response = await this.client.get(url, { params, ...config });
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  async post(url, data = {}, config = {}) {
    try {
      const response = await this.client.post(url, data, config);
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  async put(url, data = {}, config = {}) {
    try {
      const response = await this.client.put(url, data, config);
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  async delete(url, config = {}) {
    try {
      const response = await this.client.delete(url, config);
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  _handleError(error) {
    const err = {
      status: error.response?.status || 500,
      message: error.response?.data?.message || error.message || "Unknown error",
      data: error.response?.data || null,
    };
    console.error(`[BaseService Error] ${err.message}`);
    return err;
  }
}
