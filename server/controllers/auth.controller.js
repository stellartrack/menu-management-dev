// controllers/auth.controller.js
import jwt from "jsonwebtoken";
import { AuthService } from "../services/auth.service.js";
import { MESSAGES } from "../constants/messages.js";
import { createBaseController } from "./factory/base.controller.factory.js";
import { extractCookie, createSignedToken } from "../helpers/cookie.helper.js";

const COOKIE_NAME = "mern_shared_auth_token";
import { JWT_SECRET, NODE_ENV } from "../config/env.js";

// Laravel token extraction & payload builder
const buildAuthPayload = (req) => {
  const token = extractCookie(req.headers.cookie, COOKIE_NAME);
  if (!token) throw { statusCode: 401, message: "No token found" };

  const decoded = jwt.verify(token, JWT_SECRET);
  const laravelToken = decoded?.laravelToken || decoded?.token;
  if (!laravelToken) throw { statusCode: 401, message: "Laravel token missing" };

  return {
    headers: { Cookie: `shared_auth_token=${laravelToken}` },
    laravelToken,
  };
};

// Base controller for token expiry & refresh
export const AuthController = createBaseController(AuthService, {
  messages: MESSAGES.AUTH,
  aliases: {
    get: "checkExpiry",
    create: "refresh",
  },
  buildPayload: buildAuthPayload,
});

// ---- ✅ Manual controllers ----

// Set signed JWT cookie
export const setAuth = (req, res) => {
  const token = createSignedToken(req.body);

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return res.json({ success: true });
};

// Clear auth cookie
export const logout = (req, res) => {
  res.clearCookie(COOKIE_NAME, { path: "/" });
  res.json({ success: true });
};
