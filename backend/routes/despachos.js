// backend/routes/despachos.js
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { Op } = require('sequelize');   // 👈 agrega esto

// ====================
// CRUD DESPACHOS
// ====================

// Crear despacho (trabajador)  🔹 (esta parte ya estaba bien)
router.post('/', authenticateToken, async (req, res) => {
  if (req.user.role !== 'trabajador') {
    return res.status(403).json({ error: 'Acceso denegado' });
  }

  const { direccion, cliente, telefono, boleta, notas, productos, lat, lng } = req.body;

  if (!direccion || !cliente || !telefono || !boleta || !productos?.length) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }

  try {
    const despacho = await global.Despacho.create({
      direccion,
      cliente,
      telefono,
      boleta,
      notas,
      productos,
      lat,
      lng,
      UserId: req.user.id,
      estado: 'pendiente'
    });

    res.status(201).json(despacho);
  } catch (error) {
    console.error('Error al crear despacho:', error);
    res.status(500).json({ error: 'Error interno' });
  }
});

// =========== ESTE ES EL IMPORTANTE ===========
// Listar MIS despachos (trabajador o beta)
router.get('/my', authenticateToken, async (req, res) => {
  try {
    // TRABAJADOR: los que él creó
    if (req.user.role === 'trabajador') {
      const despachos = await global.Despacho.findAll({
        where: { UserId: req.user.id },
        order: [['createdAt', 'DESC']]
      });
      return res.json(despachos);
    }

    // BETA: los que tiene ASIGNADOS (driver_id = id del usuario)
    if (req.user.role === 'beta') {
      const despachos = await global.Despacho.findAll({
        where: {
          driverId: req.user.id,
          estado: { [Op.in]: ['tomado', 'en_camino', 'entregado'] }
        },
        order: [['updatedAt', 'DESC']]
      });
      return res.json(despachos);
    }

    return res.status(403).json({ error: 'Acceso denegado' });
  } catch (error) {
    console.error('Error en /despachos/my:', error);
    res.status(500).json({ error: error.message });
  }
});

// Listar despachos pendientes (beta) o todos del trabajador
router.get('/', authenticateToken, async (req, res) => {
  if (!['trabajador', 'beta'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Acceso denegado' });
  }

  try {
    const where = req.user.role === 'trabajador'
      ? { UserId: req.user.id }
      : { estado: 'pendiente' };

    const despachos = await global.Despacho.findAll({
      where,
      order: [['createdAt', 'ASC']]
    });
    res.json(despachos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener un despacho por ID (ajusto beta para usar driverId)
router.get('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const despacho = await global.Despacho.findByPk(id);
    if (!despacho) return res.status(404).json({ error: 'Despacho no encontrado' });

    if (req.user.role === 'trabajador' && despacho.UserId !== req.user.id) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    if (req.user.role === 'beta' && despacho.driverId !== req.user.id) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    res.json(despacho);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Tomar despacho (beta)
router.put('/:id/tomar', authenticateToken, async (req, res) => {
  if (req.user.role !== 'beta') return res.status(403).json({ error: 'Acceso denegado' });

  const { id } = req.params;
  const { camion } = req.body;

  if (!camion) return res.status(400).json({ error: 'Camión requerido' });

  try {
    const despacho = await global.Despacho.findByPk(id);
    if (!despacho || despacho.estado !== 'pendiente') {
      return res.status(404).json({ error: 'Despacho no disponible' });
    }

    despacho.estado = 'tomado';
    despacho.camion = camion;
    despacho.driverId = req.user.id;   // 👈 aquí se asigna el beta
    await despacho.save();

    res.json(despacho);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Salir a despacho (beta)
router.put('/:id/salir', authenticateToken, async (req, res) => {
  if (req.user.role !== 'beta') return res.status(403).json({ error: 'Acceso denegado' });

  const { id } = req.params;

  try {
    const despacho = await global.Despacho.findByPk(id);
    if (!despacho || despacho.estado !== 'tomado' || despacho.driverId !== req.user.id) {
      return res.status(404).json({ error: 'Despacho no tomado por ti' });
    }

    despacho.estado = 'en_camino';
    await despacho.save();

    res.json(despacho);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
