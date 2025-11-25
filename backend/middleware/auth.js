// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error('JWT_SECRET no está definido en .env');
    return res.status(500).json({ error: 'Error de configuración del servidor' });
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expirado' });
      }
      if (err.name === 'JsonWebTokenError') {
        return res.status(403).json({ error: 'Token inválido' });
      }
      return res.status(403).json({ error: 'Error al verificar token' });
    }

    // Normalizar datos del usuario
    req.user = {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role,
      camion: decoded.camion || null // ← Crucial para beta
    };

    next();
  });
};

module.exports = { authenticateToken };