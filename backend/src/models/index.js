const Usuario = require('./Usuario');
const Transaccion = require('./Transaccion');
const Orden = require('./Orden');
const CodigoPromocional = require('./CodigoPromocional');

// Definir relaciones entre modelos
Usuario.hasMany(Transaccion, {
  foreignKey: 'usuario_id',
  as: 'transacciones',
});

Transaccion.belongsTo(Usuario, {
  foreignKey: 'usuario_id',
  as: 'usuario',
});

Usuario.hasMany(Orden, {
  foreignKey: 'usuario_id',
  as: 'ordenes',
});

Orden.belongsTo(Usuario, {
  foreignKey: 'usuario_id',
  as: 'usuario',
});

Orden.hasMany(Transaccion, {
  foreignKey: 'orden_id',
  as: 'transacciones',
});

Transaccion.belongsTo(Orden, {
  foreignKey: 'orden_id',
  as: 'orden',
});

// Relaciones de CodigoPromocional
Usuario.hasMany(CodigoPromocional, {
  foreignKey: 'usado_por',
  as: 'codigos_usados',
});

CodigoPromocional.belongsTo(Usuario, {
  foreignKey: 'usado_por',
  as: 'usuario',
});

module.exports = {
  Usuario,
  Transaccion,
  Orden,
  CodigoPromocional,
};
