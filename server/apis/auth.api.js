export const checkTokenExpiry = (client, { headers }) =>
  client.get("/check-token-expiry", { headers });

export const refreshToken = (client, { headers }) =>
  client.get("/refresh-token?redirect_type=mern", { headers });
