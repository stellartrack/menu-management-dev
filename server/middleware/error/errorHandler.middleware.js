// middleware/errorHandler.js
import { handleControllerError } from "../../helpers/errorHandler.helper.js";

/**
 * Global Express error-handling middleware.
 */
const errorHandler = (err, req, res, next) => {
  // Special handling for express-validator
  if (typeof err.array === "function") {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.array(),
    });
  }

  // Standardized error response
  return handleControllerError(res, err, undefined, err.statusCode || 500);
};

export default errorHandler;
