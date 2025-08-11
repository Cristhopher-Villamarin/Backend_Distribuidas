const { DataTypes } = require('sequelize');
const { sequelize } = require('../config');
const Localidad = require('./localidad');

const Asiento = sequelize.define('Asiento', {
  idAsiento: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idLocalidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fila: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  numero: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  estado: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'disponible'
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  }
}, {
  tableName: 'Asiento', // Preserva el caso exacto
  timestamps: true, // Esto generará createdAt y updatedAt
  freezeTableName: true, // Evita que Sequelize cambie el nombre de la tabla
  indexes: [
    {
      unique: true,
      fields: ['fila', 'numero'], // Restricción de unicidad
      name: 'unique_asiento_localidad_fila_numero',
    },
  ],
});

// Relaciones
Asiento.belongsTo(Localidad, { foreignKey: 'idLocalidad', targetKey: 'idLocalidad' });
Localidad.hasMany(Asiento, { foreignKey: 'idLocalidad', sourceKey: 'idLocalidad' });

module.exports = Asiento;