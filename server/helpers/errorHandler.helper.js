// helpers/errorHandler.js
import { errorResponse } from "./response.helper.js";
import { MESSAGES } from "../constants/messages.js";
import { logError } from "../utils/logger.js"; // 🔥 import logger

/**
 * Generic error handler for controllers and middleware.
 *
 * @param {object} res - Express response object
 * @param {Error} error - The caught error
 * @param {string} fallbackMsg - Default fallback message
 * @param {number} statusCode - Optional HTTP status (defaults to 500)
 */
export const handleControllerError = (
  res,
  error,
  fallbackMsg = MESSAGES.ERROR.INTERNAL,
  statusCode = 500
) => {
  const message =
    error?.response?.data?.error ||
    error?.message ||
    fallbackMsg;

  // 🔥 Centralized logging
  logError(error);

  return errorResponse(res, message, statusCode);
};
