const { DataTypes } = require('sequelize');
const { sequelize } = require('../config');

const Localidad = sequelize.define('Localidad', {
  idLocalidad: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  idEvento: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: { msg: 'El evento es obligatorio' }
    }
  },
  precio: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  },
  capacidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  disponibilidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  nombre_localidad: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
  
}, {
  tableName: 'Localidad',
  timestamps: true
});

module.exports = Localidad;