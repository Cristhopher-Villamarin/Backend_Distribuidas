const { DataTypes } = require('sequelize');
const { sequelize } = require('../config');

const Evento = sequelize.define('Evento', {
  idEvento: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  idCategoria: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: { msg: 'La categoría es obligatoria' }
    }
  },
  nombreEvento: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      notNull: { msg: 'El nombre del evento es obligatorio' },
      len: { args: [2, 20], msg: 'El nombre debe tener entre 2 y 20 caracteres' }
    },
    unique: true
  },
  fecha_inicio: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      notNull: { msg: 'La fecha de inicio es obligatoria' },
      isDate: { msg: 'La fecha de inicio debe ser válida' }
    }
  },
  fecha_fin: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      notNull: { msg: 'La fecha de fin es obligatoria' },
      isDate: { msg: 'La fecha de fin debe ser válida' }
    }
  },
  hora_inicio: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      notNull: { msg: 'La hora de inicio es obligatoria' },
      isDate: { msg: 'La hora de inicio debe ser válida' }
    }
  },
  ubicacion: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notNull: { msg: 'La ubicación es obligatoria' },
      len: { args: [2, 100], msg: 'La ubicación debe tener entre 2 y 100 caracteres' }
    }
  },
  descripcion: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  estado: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'activo',
    validate: {
      isIn: {
        args: [['activo', 'inactivo', 'cancelado']],
        msg: 'Estado inválido'
      }
    }
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
  tableName: 'Evento',
  timestamps: true,
  indexes: [
    {
      unique: true,
      name: 'unique_evento_ubicacion_fechas',
      fields: ['ubicacion', 'fecha_inicio', 'fecha_fin', 'hora_inicio']
    }
     ]
});


module.exports = Evento;