const { DataTypes } = require('sequelize');
const { sequelize } = require('../config');

const Localidad = sequelize.define('Localidad', {
  idLocalidad: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idEvento: {
    type: DataTypes.INTEGER,
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
    unique: true
  }
}, {
  tableName: 'Localidad', // Preserva el caso exacto
  timestamps: true, // Esto generará createdAt y updatedAt
  freezeTableName: true // Evita que Sequelize cambie el nombre de la tabla a plural
});

module.exports = Localidad;