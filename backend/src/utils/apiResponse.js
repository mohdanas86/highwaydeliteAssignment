/*
 * apiResponse is a utility to standardize API responses.
 * It ensures a consistent structure for successful and error responses.
 *
 * @param {Object} res - The Express response object
 * @param {Object} data - The data to include in the response
 * @param {number} [statusCode=200] - The HTTP status code for the response
 */
class ApiResponse {
  constructor(statusCode, data, message = 'Success') {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

export { ApiResponse };
