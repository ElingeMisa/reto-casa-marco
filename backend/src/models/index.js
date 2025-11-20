const Usuario = require('./Usuario');
const Transaccion = require('./Transaccion');
const Orden = require('./Orden');

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

module.exports = {
  Usuario,
  Transaccion,
  Orden,
};
