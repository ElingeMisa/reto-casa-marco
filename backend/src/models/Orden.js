const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Orden = sequelize.define('orden', {
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
  tipo_orden: {
    type: DataTypes.ENUM('evento', 'membresia', 'donacion'),
    allowNull: false,
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0.01,
    },
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'pagado', 'cancelado', 'reembolsado'),
    allowNull: false,
    defaultValue: 'pendiente',
  },
  detalles: {
    type: DataTypes.JSONB,
    allowNull: false,
    // Guardará información como: tipo de boletos, cantidad, fecha del evento, etc.
  },
  fecha_evento: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  timestamps: true,
  createdAt: 'creado_en',
  updatedAt: 'actualizado_en',
});

module.exports = Orden;
