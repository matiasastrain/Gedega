const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Registro
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  
  if (!password || password.length < 8) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await global.User.create({ 
      username, 
      email, 
      password: hashedPassword, 
      role: 'beta' 
    });
    
    res.status(201).json({ 
      message: 'Usuario creado', 
      user: { id: user.id, username, email, role: user.role } 
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      const field = error.errors[0].path;
      const message = field === 'username' ? 'El nombre de usuario ya está en uso' : 'El email ya está registrado';
      return res.status(400).json({ error: message });
    }
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await global.User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: { id: user.id, username: user.username, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;