// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');
require('dotenv').config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Access token not found.' });
  }

  jwt.verify(token, ACCESS_TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      // Phân biệt lỗi token hết hạn và token không hợp lệ
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Access token expired.' });
      }
      return res.status(403).json({ message: 'Invalid access token.' });
    }
    
    try {
      // Fetch user details including role from database
      const user = await prisma.users.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          role: true
        }
      });

      if (!user) {
        return res.status(401).json({ message: 'User not found.' });
      }

      req.user = {
        userId: user.id,
        email: user.email,
        role: user.role
      };
      next();
    } catch (error) {
      console.error('Error fetching user in auth middleware:', error);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  });
};

module.exports = authenticateToken;