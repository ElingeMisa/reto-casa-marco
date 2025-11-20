const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const argon2 = require('argon2');

const Usuario = sequelize.define('usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100],
    },
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true,
    },
    // Se cifrará en el nivel de aplicación antes de guardar
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  saldo: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
    validate: {
      min: 0,
    },
  },
  rol: {
    type: DataTypes.ENUM('usuario', 'administrador'),
    allowNull: false,
    defaultValue: 'usuario',
  },
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  ultimo_acceso: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  timestamps: true,
  createdAt: 'creado_en',
  updatedAt: 'actualizado_en',

  // Hooks para seguridad
  hooks: {
    beforeCreate: async (usuario) => {
      // Hash de password con Argon2
      if (usuario.password) {
        usuario.password = await argon2.hash(usuario.password, {
          type: argon2.argon2id,
          memoryCost: 65536, // 64 MB
          timeCost: 3,
          parallelism: 4,
        });
      }
    },
    beforeUpdate: async (usuario) => {
      // Solo hashear si la password cambió
      if (usuario.changed('password')) {
        usuario.password = await argon2.hash(usuario.password, {
          type: argon2.argon2id,
          memoryCost: 65536,
          timeCost: 3,
          parallelism: 4,
        });
      }
    },
  },
});

// Método de instancia para validar password
Usuario.prototype.validarPassword = async function(password) {
  try {
    return await argon2.verify(this.password, password);
  } catch (error) {
    console.error('Error al validar password:', error);
    return false;
  }
};

// Método para obtener usuario sin datos sensibles
Usuario.prototype.toJSON = function() {
  const values = { ...this.get() };
  delete values.password;
  return values;
};

module.exports = Usuario;
