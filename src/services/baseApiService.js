/**
 * Base API Service
 * Provides a centralized API layer with error handling, interceptors, and utilities
 */

class BaseApiService {
  constructor(baseURL = '') {
    this.baseURL = baseURL;
    this.requestInterceptors = [];
    this.responseInterceptors = [];
    this.errorHandlers = [];
  }

  /**
   * Add a request interceptor
   * @param {Function} interceptor - Function that receives and modifies the request config
   */
  addRequestInterceptor(interceptor) {
    this.requestInterceptors.push(interceptor);
  }

  /**
   * Add a response interceptor
   * @param {Function} interceptor - Function that receives and modifies the response
   */
  addResponseInterceptor(interceptor) {
    this.responseInterceptors.push(interceptor);
  }

  /**
   * Add an error handler
   * @param {Function} handler - Function that handles errors
   */
  addErrorHandler(handler) {
    this.errorHandlers.push(handler);
  }

  /**
   * Process request through interceptors
   * @param {Object} config - Request configuration
   * @returns {Object} Modified configuration
   */
  async processRequestInterceptors(config) {
    let modifiedConfig = { ...config };

    for (const interceptor of this.requestInterceptors) {
      modifiedConfig = await interceptor(modifiedConfig);
    }

    return modifiedConfig;
  }

  /**
   * Process response through interceptors
   * @param {any} response - Response data
   * @returns {any} Modified response
   */
  async processResponseInterceptors(response) {
    let modifiedResponse = response;

    for (const interceptor of this.responseInterceptors) {
      modifiedResponse = await interceptor(modifiedResponse);
    }

    return modifiedResponse;
  }

  /**
   * Handle errors through error handlers
   * @param {Error} error - Error object
   */
  async handleError(error) {
    for (const handler of this.errorHandlers) {
      await handler(error);
    }
    throw error;
  }

  /**
   * Simulated HTTP GET request
   * @param {string} endpoint - API endpoint
   * @param {Object} config - Request configuration
   * @returns {Promise} Response data
   */
  async get(endpoint, config = {}) {
    try {
      const processedConfig = await this.processRequestInterceptors({
        method: 'GET',
        endpoint,
        ...config
      });

      // In a real app, this would be: fetch(this.baseURL + endpoint)
      // For mock data, we'll return a promise
      const response = await this.mockRequest(processedConfig);

      return await this.processResponseInterceptors(response);
    } catch (error) {
      return await this.handleError(error);
    }
  }

  /**
   * Simulated HTTP POST request
   * @param {string} endpoint - API endpoint
   * @param {any} data - Request payload
   * @param {Object} config - Request configuration
   * @returns {Promise} Response data
   */
  async post(endpoint, data, config = {}) {
    try {
      const processedConfig = await this.processRequestInterceptors({
        method: 'POST',
        endpoint,
        data,
        ...config
      });

      const response = await this.mockRequest(processedConfig);

      return await this.processResponseInterceptors(response);
    } catch (error) {
      return await this.handleError(error);
    }
  }

  /**
   * Simulated HTTP PUT request
   * @param {string} endpoint - API endpoint
   * @param {any} data - Request payload
   * @param {Object} config - Request configuration
   * @returns {Promise} Response data
   */
  async put(endpoint, data, config = {}) {
    try {
      const processedConfig = await this.processRequestInterceptors({
        method: 'PUT',
        endpoint,
        data,
        ...config
      });

      const response = await this.mockRequest(processedConfig);

      return await this.processResponseInterceptors(response);
    } catch (error) {
      return await this.handleError(error);
    }
  }

  /**
   * Simulated HTTP DELETE request
   * @param {string} endpoint - API endpoint
   * @param {Object} config - Request configuration
   * @returns {Promise} Response data
   */
  async delete(endpoint, config = {}) {
    try {
      const processedConfig = await this.processRequestInterceptors({
        method: 'DELETE',
        endpoint,
        ...config
      });

      const response = await this.mockRequest(processedConfig);

      return await this.processResponseInterceptors(response);
    } catch (error) {
      return await this.handleError(error);
    }
  }

  /**
   * Mock request handler - simulates API latency
   * In production, replace with actual fetch/axios call
   * @param {Object} config - Request configuration
   * @returns {Promise} Mock response
   */
  async mockRequest(config) {
    // Simulate network delay (50-200ms)
    const delay = Math.random() * 150 + 50;
    await new Promise(resolve => setTimeout(resolve, delay));

    return {
      data: config.mockData || null,
      status: 200,
      statusText: 'OK',
      config
    };
  }

  /**
   * Retry logic for failed requests
   * @param {Function} requestFn - Request function to retry
   * @param {number} retries - Number of retries
   * @param {number} delay - Delay between retries
   * @returns {Promise} Response data
   */
  async retry(requestFn, retries = 3, delay = 1000) {
    try {
      return await requestFn();
    } catch (error) {
      if (retries === 0) {
        throw error;
      }

      await new Promise(resolve => setTimeout(resolve, delay));
      return this.retry(requestFn, retries - 1, delay);
    }
  }
}

// Create singleton instance
const baseApiService = new BaseApiService('/api');

// Add default request interceptor (e.g., for auth tokens)
baseApiService.addRequestInterceptor((config) => {
  // Add authentication token if available
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers = {
      ...config.headers,
      'Authorization': `Bearer ${token}`
    };
  }

  // Add timestamp to all requests
  config.timestamp = new Date().toISOString();

  return config;
});

// Add default response interceptor
baseApiService.addResponseInterceptor((response) => {
  // Log successful responses in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[API Response]', response);
  }

  return response;
});

// Add default error handler
baseApiService.addErrorHandler((error) => {
  console.error('[API Error]', error);

  // Handle specific error codes
  if (error.status === 401) {
    // Redirect to login on unauthorized
    window.location.href = '/login';
  }

  if (error.status === 403) {
    // Redirect to unauthorized page
    window.location.href = '/unauthorized';
  }
});

export default baseApiService;
