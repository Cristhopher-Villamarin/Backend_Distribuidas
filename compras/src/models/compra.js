const { DataTypes } = require('sequelize');
const { sequelize } = require('../config');

const Compra = sequelize.define('Compra', {
  idCompra: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  idCliente: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  asientos: {
    type: DataTypes.JSON, // Array de idAsiento seleccionados por el usuario
    allowNull: false
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1 // Ajustable si es por asiento
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  iva: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  montoTotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  fechaCompra: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  horaCompra: {
    type: DataTypes.TIME,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  metodoCompra: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  estado: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'pendiente'
  }
}, {
  tableName: 'Compra',
  timestamps: true
});

module.exports = Compra;