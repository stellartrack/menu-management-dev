// helpers/cookie.helper.js
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";


// Extract named cookie value from cookie header
export const extractCookie = (cookieHeader = "", name) => {
  const match = cookieHeader.match(new RegExp(`${name}=([^;]+)`));
  return match ? match[1] : null;
};

// Create signed JWT token with 1 day expiry
export const createSignedToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
};
