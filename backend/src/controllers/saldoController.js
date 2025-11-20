const { validationResult } = require('express-validator');
const { Usuario, Transaccion } = require('../models');
const { sequelize } = require('../config/database');

// Recargar saldo (simulación)
const recargarSaldo = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    // Validar entrada
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      await transaction.rollback();
      return res.status(400).json({
        error: 'Datos inválidos',
        detalles: errores.array(),
      });
    }

    const { monto, metodo_pago } = req.body;
    const usuarioId = req.usuario.id;

    // Validar monto
    if (monto <= 0 || monto > 10000) {
      await transaction.rollback();
      return res.status(400).json({
        error: 'Monto inválido',
        mensaje: 'El monto debe estar entre $0.01 y $10,000',
      });
    }

    // Obtener usuario con lock para evitar race conditions
    const usuario = await Usuario.findByPk(usuarioId, {
      lock: transaction.LOCK.UPDATE,
      transaction,
    });

    const saldoAnterior = parseFloat(usuario.saldo);
    const saldoNuevo = saldoAnterior + parseFloat(monto);

    // Actualizar saldo
    await usuario.update(
      { saldo: saldoNuevo },
      { transaction }
    );

    // Registrar transacción
    const transaccion = await Transaccion.create({
      usuario_id: usuarioId,
      tipo: 'recarga',
      monto,
      saldo_anterior: saldoAnterior,
      saldo_nuevo: saldoNuevo,
      descripcion: `Recarga de saldo vía ${metodo_pago || 'tarjeta'}`,
      metodo_pago: metodo_pago || 'tarjeta',
    }, { transaction });

    await transaction.commit();

    res.json({
      mensaje: 'Recarga exitosa',
      transaccion: {
        id: transaccion.id,
        tipo: transaccion.tipo,
        monto: parseFloat(transaccion.monto),
        saldo_anterior: parseFloat(transaccion.saldo_anterior),
        saldo_nuevo: parseFloat(transaccion.saldo_nuevo),
        fecha: transaccion.creado_en,
      },
      saldo_actual: parseFloat(saldoNuevo),
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Error en recarga de saldo:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      mensaje: 'No se pudo completar la recarga',
    });
  }
};

// Obtener historial de transacciones
const obtenerHistorial = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { limite = 10, pagina = 1 } = req.query;

    const offset = (pagina - 1) * limite;

    const transacciones = await Transaccion.findAndCountAll({
      where: { usuario_id: usuarioId },
      order: [['creado_en', 'DESC']],
      limit: parseInt(limite),
      offset: parseInt(offset),
    });

    res.json({
      transacciones: transacciones.rows.map(t => ({
        id: t.id,
        tipo: t.tipo,
        monto: parseFloat(t.monto),
        saldo_anterior: parseFloat(t.saldo_anterior),
        saldo_nuevo: parseFloat(t.saldo_nuevo),
        descripcion: t.descripcion,
        fecha: t.creado_en,
      })),
      total: transacciones.count,
      pagina: parseInt(pagina),
      total_paginas: Math.ceil(transacciones.count / limite),
    });

  } catch (error) {
    console.error('Error al obtener historial:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
    });
  }
};

module.exports = {
  recargarSaldo,
  obtenerHistorial,
};
