const jwt = require('jsonwebtoken');
const JWT_SECRET = 'pet-service-platform-secret-key';

const merchantAuth = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.json({
      code: 1003,
      message: '未登录',
      data: null,
      timestamp: Date.now(),
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.type !== 'merchant') {
      return res.json({
        code: 1003,
        message: '无权访问',
        data: null,
        timestamp: Date.now(),
      });
    }
    req.merchant = decoded;
    next();
  } catch (error) {
    return res.json({
      code: 1003,
      message: 'token无效或已过期',
      data: null,
      timestamp: Date.now(),
    });
  }
};

module.exports = merchantAuth;
