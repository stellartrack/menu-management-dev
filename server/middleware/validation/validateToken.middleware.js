const validateSetAuth = (req, res, next) => {
  const authData = req.body;

  if (!authData || typeof authData !== 'object' || Object.keys(authData).length === 0) {
    return res.status(400).json({ success: false, message: 'No auth data provided' });
  }

  next();
};

export default validateSetAuth;
