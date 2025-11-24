const express = require('express');
const router = express.Router(); // ← FALTABA ESTO
const bcrypt = require('bcrypt');
const { authenticateToken } = require('../middleware/auth');

// Obtener todos
router.get('/', authenticateToken, async (req, res) => {
  if (req.user.role !== 'propietario') {
    return res.status(403).json({ error: 'Acceso denegado' });
  }
  try {
    const users = await global.User.findAll({
      attributes: ['id', 'username', 'email', 'role']
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear usuario
router.post('/', authenticateToken, async (req, res) => {
  if (req.user.role !== 'propietario') {
    return res.status(403).json({ error: 'Acceso denegado' });
  }

  const { username, email, password, role } = req.body;
  if (!password || password.length < 8) {
    return res.status(400).json({ error: 'Contraseña mínima 8 caracteres' });
  }
  if (!['beta', 'trabajador', 'administrador', 'propietario'].includes(role)) {
    return res.status(400).json({ error: 'Rol inválido' });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = await global.User.create({ username, email, password: hashed, role });
    res.status(201).json({ message: 'Usuario creado', user: { id: user.id, username, email, role } });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      const field = error.errors[0].path;
      const msg = field === 'username' ? 'Usuario ya existe' : 'Email ya registrado';
      return res.status(400).json({ error: msg });
    }
    res.status(500).json({ error: 'Error interno' });
  }
});

// Cambiar rol
router.put('/:id/role', authenticateToken, async (req, res) => {
  if (req.user.role !== 'propietario') return res.status(403).json({ error: 'Acceso denegado' });
  const { id } = req.params;
  const { role } = req.body;
  if (!['beta', 'trabajador', 'administrador', 'propietario'].includes(role)) {
    return res.status(400).json({ error: 'Rol inválido' });
  }
  try {
    const user = await global.User.findByPk(id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    user.role = role;
    await user.save();
    res.json({ message: 'Rol actualizado', role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar usuario
router.delete('/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'propietario') return res.status(403).json({ error: 'Acceso denegado' });
  const { id } = req.params;
  if (parseInt(id) === req.user.id) return res.status(400).json({ error: 'No puedes eliminarse' });
  try {
    const user = await global.User.findByPk(id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    await user.destroy();
    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error interno' });
  }
});

// Cambiar contraseña propia
router.put('/:id/password', authenticateToken, async (req, res) => {
  if (req.user.id !== parseInt(req.params.id)) {
    return res.status(403).json({ error: 'Acceso denegado' });
  }

  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword || newPassword.length < 8) {
    return res.status(400).json({ error: 'Datos inválidos' });
  }

  try {
    const user = await global.User.findByPk(req.user.id);
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) return res.status(401).json({ error: 'Contraseña actual incorrecta' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Contraseña actualizada' });
  } catch (error) {
    res.status(500).json({ error: 'Error interno' });
  }
});

module.exports = router; // ← NO OLVIDAR