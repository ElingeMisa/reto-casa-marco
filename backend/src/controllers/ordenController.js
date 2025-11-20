const { validationResult } = require('express-validator');
const { Usuario, Orden, Transaccion } = require('../models');
const { sequelize } = require('../config/database');

// Crear orden y procesar compra
const crearOrden = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      await transaction.rollback();
      return res.status(400).json({
        error: 'Datos inválidos',
        detalles: errores.array(),
      });
    }

    const { tipo_orden, total, detalles, fecha_evento } = req.body;
    const usuarioId = req.usuario.id;

    // Obtener usuario con lock
    const usuario = await Usuario.findByPk(usuarioId, {
      lock: transaction.LOCK.UPDATE,
      transaction,
    });

    // Verificar saldo suficiente
    if (parseFloat(usuario.saldo) < parseFloat(total)) {
      await transaction.rollback();
      return res.status(400).json({
        error: 'Saldo insuficiente',
        mensaje: `Saldo actual: $${usuario.saldo}. Se requiere: $${total}`,
      });
    }

    // Crear orden
    const orden = await Orden.create({
      usuario_id: usuarioId,
      tipo_orden,
      total,
      estado: 'pendiente',
      detalles,
      fecha_evento,
    }, { transaction });

    // Descontar del saldo
    const saldoAnterior = parseFloat(usuario.saldo);
    const saldoNuevo = saldoAnterior - parseFloat(total);

    await usuario.update({ saldo: saldoNuevo }, { transaction });

    // Registrar transacción
    const transaccion = await Transaccion.create({
      usuario_id: usuarioId,
      tipo: 'compra',
      monto: total,
      saldo_anterior: saldoAnterior,
      saldo_nuevo: saldoNuevo,
      descripcion: `Compra de ${tipo_orden}`,
      orden_id: orden.id,
    }, { transaction });

    // Actualizar estado de orden a pagado
    await orden.update({ estado: 'pagado' }, { transaction });

    await transaction.commit();

    res.status(201).json({
      mensaje: 'Compra realizada exitosamente',
      orden: {
        id: orden.id,
        tipo_orden: orden.tipo_orden,
        total: parseFloat(orden.total),
        estado: orden.estado,
        detalles: orden.detalles,
        fecha_evento: orden.fecha_evento,
      },
      saldo_restante: parseFloat(saldoNuevo),
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Error al crear orden:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      mensaje: 'No se pudo completar la compra',
    });
  }
};

// Obtener órdenes del usuario
const obtenerOrdenes = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    const ordenes = await Orden.findAll({
      where: { usuario_id: usuarioId },
      order: [['creado_en', 'DESC']],
      limit: 50,
    });

    res.json({
      ordenes: ordenes.map(o => ({
        id: o.id,
        tipo_orden: o.tipo_orden,
        total: parseFloat(o.total),
        estado: o.estado,
        detalles: o.detalles,
        fecha_evento: o.fecha_evento,
        fecha_compra: o.creado_en,
      })),
    });

  } catch (error) {
    console.error('Error al obtener órdenes:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
    });
  }
};

module.exports = {
  crearOrden,
  obtenerOrdenes,
};
