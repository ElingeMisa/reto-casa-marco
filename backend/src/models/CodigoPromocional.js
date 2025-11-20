const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CodigoPromocional = sequelize.define('CodigoPromocional', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  codigo: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [3, 50],
    },
  },
  monto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0.01,
    },
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  usado_por: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'usuario',
      key: 'id',
    },
  },
  fecha_uso: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  expira_en: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  creado_en: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'creado_en',
  },
}, {
  tableName: 'codigos_promocionales',
  timestamps: false,
  indexes: [
    { fields: ['codigo'] },
    { fields: ['activo'] },
    { fields: ['usado_por'] },
  ],
});

// Método para verificar si un código es válido
CodigoPromocional.esValido = function(codigo) {
  return this.findOne({
    where: {
      codigo,
      activo: true,
      usado_por: null,
    },
  });
};

// Método para canjear un código
CodigoPromocional.canjear = async function(codigo, usuarioId, transaction) {
  const codigoPromo = await this.findOne({
    where: { codigo },
    transaction,
  });

  if (!codigoPromo) {
    throw new Error('Código no válido');
  }

  if (!codigoPromo.activo) {
    throw new Error('Este código ya no está activo');
  }

  if (codigoPromo.usado_por) {
    throw new Error('Este código ya fue utilizado');
  }

  if (codigoPromo.expira_en && new Date() > new Date(codigoPromo.expira_en)) {
    throw new Error('Este código ha expirado');
  }

  // Marcar como usado
  await codigoPromo.update(
    {
      usado_por: usuarioId,
      fecha_uso: new Date(),
      activo: false,
    },
    { transaction }
  );

  return codigoPromo;
};

module.exports = CodigoPromocional;
