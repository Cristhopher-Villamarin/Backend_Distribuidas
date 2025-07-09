const { DataTypes } = require('sequelize');
const { sequelize } = require('../config');

const Entrada = sequelize.define('Entrada', {
  idEntrada: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  idCompra: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  idAsiento: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  codigoQR: {
    type: DataTypes.TEXT, // Cambiado de STRING a TEXT
    allowNull: false
  },
  estado: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'activa'
  }
}, {
  tableName: 'Entrada',
  timestamps: true
});

module.exports = Entrada;