const { DataTypes } = require('sequelize');
const { sequelize } = require('../config');

const Evento = sequelize.define('Evento', {
  idEvento: {
    type: DataTypes.BIGINT,
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
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notNull: { msg: 'El nombre del evento es obligatorio' },
      len: { args: [2, 100], msg: 'El nombre debe tener entre 2 y 100 caracteres' }
    }
  },
  fecha_inicio: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      notNull: { msg: 'La fecha de inicio es obligatoria' },
      isDate: { msg: 'Formato de fecha inválido' }
    }
  },
  fecha_fin: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      notNull: { msg: 'La fecha de fin es obligatoria' },
      isDate: { msg: 'Formato de fecha inválido' }
    }
  },
  hora_inicio: {
    type: DataTypes.TIME,
    allowNull: false,
    validate: {
      notNull: { msg: 'La hora de inicio es obligatoria' },
      isTime: { msg: 'Formato de hora inválido' }
    }
  },
  ubicacion: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notNull: { msg: 'La ubicación es obligatoria' },
      len: { args: [5, 200], msg: 'La ubicación debe tener entre 5 y 200 caracteres' }
    }
  },
  descripcion: {
    type: DataTypes.STRING(500),
    allowNull: true,
    validate: {
      len: { args: [0, 500], msg: 'La descripción no debe exceder los 500 caracteres' }
    }
  },
  estado: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'pendiente',
    validate: {
      isIn: {
        args: [['pendiente', 'activo', 'cancelado', 'completado']],
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
  timestamps: true
});

Evento.associate = (models) => {
  Evento.belongsTo(models.Categoria, { foreignKey: 'idCategoria' });
};

module.exports = Evento;