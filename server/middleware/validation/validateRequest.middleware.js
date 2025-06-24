import { validationResult } from "express-validator";
import { errorResponse } from "../../helpers/response.helper.js";
import { MESSAGES } from "../../constants/messages.js";

/**
 * Middleware to validate request using express-validator
 */
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return errorResponse(res, MESSAGES.ERROR.VALIDATION, 400, errors.array());
  }

  next();
};
