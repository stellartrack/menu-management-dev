const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {

  const token = req.cookies?.mern_shared_auth_token;

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
  }

  try {
    // Verify the JWT token from the cookie
    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);

    // If your token payload contains another nested token, verify it as well
    // (Only do this if necessary, else this line can be removed)
    const userData = jwt.verify(decodedPayload.token, process.env.JWT_SECRET);

    // Attach user info to request object for next middleware/controllers
    req.user = userData;
    req.laravelToken = decodedPayload.token;
    req.nodeToken = token;

    next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    return res.status(403).json({ success: false, message: "Invalid or expired token" });
  }
};
