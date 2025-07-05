const { DataTypes } = require('sequelize');
const { sequelize } = require('../config');
const Localidad = require('./localidad');

const Asiento = sequelize.define('Asiento', {
  idAsiento: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  idLocalidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Localidad,
      key: 'idLocalidad'
    }
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
    type: DataTypes.DECIMAL(10,2),
    allowNull: true
  }
}, {
  tableName: 'Asiento',
  timestamps: true
});

// Relaciones
Asiento.belongsTo(Localidad, { foreignKey: 'idLocalidad' });
Localidad.hasMany(Asiento, { foreignKey: 'idLocalidad' });

module.exports = Asiento;