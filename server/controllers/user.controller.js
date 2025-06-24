// controllers/user.controller.js

import { UserService } from "../services/user.service.js";
import { errorResponse, successResponse } from "../helpers/response.helper.js";

export const UserController = {
  getProfile: (req, res) => {
    try {
      if (!req.user) {
        return errorResponse(res, "Unauthorized", 401);
      }

      const data = UserService.getProfile(req.user, req.laravelToken, req.nodeToken);
      return successResponse(res, "User profile fetched", data);
    } catch (err) {
      return errorResponse(res, err.message, 400);
    }
  },
};
