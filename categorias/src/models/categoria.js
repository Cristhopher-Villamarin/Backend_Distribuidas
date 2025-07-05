const { DataTypes } = require('sequelize');
const { sequelize } = require('../config');

const Categoria = sequelize.define('Categoria', {
  idCategoria: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notNull: { msg: 'El nombre es obligatorio' },
      len: { args: [2, 50], msg: 'El nombre debe tener entre 2 y 50 caracteres' }
    }
  },
  descripcion: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'Categoria',
  timestamps: true
});

Categoria.associate = (models) => {
  Categoria.hasMany(models.Usuario, { foreignKey: 'idCategoria' });
};

module.exports = Categoria;