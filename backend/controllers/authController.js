const jwt = require('jsonwebtoken');
const apiAuthClient = require('../utils/apiAuthClient');
const { JWT_SECRET } = process.env;

function extractCookie(cookies, name) {
  const match = (cookies || '').match(new RegExp(`${name}=([^;]+)`));
  return match ? match[1] : '';
}

exports.checkTokenExpiry = async (req, res) => {
  try {
    const token = extractCookie(req.headers.cookie, 'mern_shared_auth_token');
    if (!token) {
      return res.status(401).json({ message: 'No token found' });
    }

    // Verify outer Node.js JWT (signedToken)
    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);

    // decodedPayload should contain laravelToken inside, adjust key if needed
    const laravelToken = decodedPayload.laravelToken || decodedPayload.token;
    if (!laravelToken) {
      return res.status(401).json({ message: 'Laravel token missing inside payload' });
    }
    const response = await apiAuthClient.get('/check-token-expiry', {
      headers: {
        Cookie: `shared_auth_token=${laravelToken}`,
      },
    });

    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Error checking token expiry:', error.message);
    return res.status(500).json({ redirect_type: 'logout' });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const token = extractCookie(req.headers.cookie, 'mern_shared_auth_token');
    if (!token) {
      return res.status(401).json({ message: 'No token found' });
    }

    // Verify outer Node.js JWT (signedToken)
    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);

    // decodedPayload should contain laravelToken inside, adjust key if needed
    const laravelToken = decodedPayload.laravelToken || decodedPayload.token;
    if (!laravelToken) {
      return res.status(401).json({ message: 'Laravel token missing inside payload' });
    }
    const response = await apiAuthClient.get('/refresh-token?redirect_type=mern', {
      headers: {
        Cookie: `shared_auth_token=${laravelToken}`,
      },
    });

    const data = response.data;
    const redirectUrl = response.headers.location || null;

    if (response.status === 200 && data.token) {

      const signedToken = jwt.sign({ token: data.token }, JWT_SECRET, {
        expiresIn: '1d',
      });


      res.cookie('mern_shared_auth_token', signedToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      });

      return res.status(200).json({
        success: true,
        message: 'Token refreshed and synced',
        redirect: redirectUrl,
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Token refresh failed at Laravel',
    });
  } catch (error) {
    const errMsg = error.response?.data || error.message;
    console.error('Error in refreshToken:', errMsg);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};



exports.setAuth = (req, res) => {
  const authData = req.body;

  // authData validated by validator middleware
  const token = jwt.sign(authData, JWT_SECRET, { expiresIn: '1d' });

  res.cookie('mern_shared_auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  return res.json({ success: true });
};

exports.logout = (req, res) => {
  res.clearCookie('mern_shared_auth_token', { path: '/' });
  res.json({ success: true });
};
