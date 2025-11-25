// backend/models/Despacho.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Despacho = sequelize.define('Despacho', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  direccion: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  cliente: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  boleta: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  notas: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  productos: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'tomado', 'en_camino', 'entregado'),
    defaultValue: 'pendiente'
  },
  camion: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  lat: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true
  },
  lng: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true
  },
  driverId: {
  type: DataTypes.INTEGER,
  allowNull: true,
  field: 'driver_id',   // nombre real de la columna en la BD
  },

  UserId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
  }, 
  {
  tableName: 'Despachos',
  timestamps: true
});

module.exports = Despacho;