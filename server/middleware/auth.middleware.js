import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";

const authMiddleware = (req, res, next) => {
  const token = req.cookies?.mern_shared_auth_token;

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
  }

  try {
    // Verify the JWT token from the cookie
    const decodedPayload = jwt.verify(token, JWT_SECRET);

    // Optionally verify nested token if needed
    const userData = jwt.verify(decodedPayload.token, JWT_SECRET);

    // Attach to request
    req.user = userData;
    req.laravelToken = decodedPayload.token;
    req.nodeToken = token;

    next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    return res.status(403).json({ success: false, message: "Invalid or expired token" });
  }
};

export default authMiddleware;
