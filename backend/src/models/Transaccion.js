const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Transaccion = sequelize.define('transaccion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuario',
      key: 'id',
    },
  },
  tipo: {
    type: DataTypes.ENUM('recarga', 'compra', 'reembolso'),
    allowNull: false,
  },
  monto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0.01,
    },
  },
  saldo_anterior: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  saldo_nuevo: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  orden_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'orden',
      key: 'id',
    },
  },
  metodo_pago: {
    type: DataTypes.STRING(50),
    allowNull: true, // Solo para recargas
  },
}, {
  timestamps: true,
  createdAt: 'creado_en',
  updatedAt: false,
});

module.exports = Transaccion;
