const { DataTypes } = require('sequelize');
const { sequelize } = require('../config');

const Usuario = sequelize.define('Usuario', {
  idCliente: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  cedula: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true,
    validate: {
      is: /^\d{10}$/,
      notNull: { msg: 'La cédula es obligatoria' }
    }
  },
  nombre: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      len: { args: [2, 20], msg: 'El nombre debe tener entre 2 y 20 caracteres' },
      notNull: { msg: 'El nombre es obligatorio' }
    }
  },
  apellido: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      len: { args: [2, 20], msg: 'El apellido debe tener entre 2 y 20 caracteres' },
      notNull: { msg: 'El apellido es obligatorio' }
    }
  },
  email: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: { msg: 'Debe ser un email válido' },
      notNull: { msg: 'El email es obligatorio' }
    }
  },
  telefono: {
    type: DataTypes.STRING(15),
    allowNull: false,
    validate: {
      is: /^\d{7,15}$/,
      notNull: { msg: 'El teléfono es obligatorio' }
    }
  },
  contrasenia: {
    type: DataTypes.STRING(100), // Hasheada
    allowNull: false,
    validate: {
      len: { args: [8, 100], msg: 'La contraseña debe tener mínimo 8 caracteres' },
      notNull: { msg: 'La contraseña es obligatoria' }
    }
  },
  direccion: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      len: { args: [5, 50], msg: 'La dirección debe tener entre 5 y 50 caracteres' },
      notNull: { msg: 'La dirección es obligatoria' }
    }
  },
  ciudad: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      notNull: { msg: 'La ciudad es obligatoria' }
    }
  },
  provincia: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      notNull: { msg: 'La provincia es obligatoria' }
    }
  },
  estado: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'activo',
    validate: {
      isIn: {
        args: [['activo', 'inactivo', 'suspendido']],
        msg: 'Estado inválido'
      }
    }
  },
  rol: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: {
        args: [['cliente', 'admin', 'organizador']],
        msg: 'Rol inválido'
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
  tableName: 'Cliente',
  timestamps: true
});

Usuario.associate = (models) => {
  Usuario.belongsTo(models.Categoria, { foreignKey: 'idCategoria' });
};
module.exports = Usuario;