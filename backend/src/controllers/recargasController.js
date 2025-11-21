const Usuario = require('../models/Usuario');
const Transaccion = require('../models/Transaccion');
const { sequelize } = require('../config/database');

/**
 * Crear una recarga de saldo (simulada - sin Stripe por ahora)
 * En producción, esto se conectaría con Stripe Checkout
 */
exports.crearRecarga = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { monto, metodo_pago } = req.body;
    const usuarioId = req.usuario.id;

    // Validaciones
    if (!monto || monto <= 0) {
      await transaction.rollback();
      return res.status(400).json({
        error: 'El monto debe ser mayor a 0',
      });
    }

    if (monto > 10000) {
      await transaction.rollback();
      return res.status(400).json({
        error: 'El monto máximo de recarga es $10,000',
      });
    }

    // Obtener usuario con lock
    const usuario = await Usuario.findByPk(usuarioId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!usuario) {
      await transaction.rollback();
      return res.status(404).json({
        error: 'Usuario no encontrado',
      });
    }

    // Actualizar saldo
    const saldoAnterior = parseFloat(usuario.saldo);
    const nuevoSaldo = saldoAnterior + parseFloat(monto);

    await usuario.update({ saldo: nuevoSaldo }, { transaction });

    // Registrar transacción
    const transaccionCreada = await Transaccion.create(
      {
        usuario_id: usuarioId,
        tipo: 'recarga',
        monto: monto,
        saldo_anterior: saldoAnterior,
        saldo_nuevo: nuevoSaldo,
        descripcion: `Recarga de saldo por ${metodo_pago || 'tarjeta'}`,
        metodo_pago: metodo_pago || 'tarjeta',
        estado: 'completada',
      },
      { transaction }
    );

    await transaction.commit();

    res.json({
      mensaje: 'Recarga exitosa',
      transaccion: {
        id: transaccionCreada.id,
        monto: parseFloat(monto),
        saldo_nuevo: parseFloat(nuevoSaldo),
        fecha: transaccionCreada.creado_en,
      },
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al procesar recarga:', error);
    res.status(500).json({
      error: 'Error al procesar la recarga',
    });
  }
};

/**
 * Crear sesión de Stripe Checkout
 * Este endpoint crearía la sesión de pago con Stripe
 * Por ahora, devuelve un mock para desarrollo
 */
exports.crearCheckoutStripe = async (req, res) => {
  try {
    const { monto } = req.body;
    const usuarioId = req.usuario.id;

    if (!monto || monto <= 0) {
      return res.status(400).json({
        error: 'El monto debe ser mayor a 0',
      });
    }

    if (monto > 10000) {
      return res.status(400).json({
        error: 'El monto máximo de recarga es $10,000',
      });
    }

    // EN PRODUCCIÓN: Aquí se crearía la sesión de Stripe Checkout
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    // const session = await stripe.checkout.sessions.create({
    //   payment_method_types: ['card'],
    //   line_items: [{
    //     price_data: {
    //       currency: 'usd',
    //       product_data: {
    //         name: 'Recarga de Saldo - Museo MARCO',
    //       },
    //       unit_amount: monto * 100,
    //     },
    //     quantity: 1,
    //   }],
    //   mode: 'payment',
    //   success_url: `${process.env.FRONTEND_URL}/recarga/exitosa?session_id={CHECKOUT_SESSION_ID}`,
    //   cancel_url: `${process.env.FRONTEND_URL}/recarga/cancelada`,
    //   client_reference_id: usuarioId.toString(),
    //   metadata: {
    //     usuario_id: usuarioId,
    //     tipo: 'recarga',
    //     monto: monto,
    //   },
    // });

    // Por ahora, devolvemos un mock para desarrollo
    res.json({
      mensaje: 'Checkout simulado - En producción usaría Stripe',
      checkout_url: `/api/v1/recargas/simular?monto=${monto}&usuario_id=${usuarioId}`,
      modo: 'desarrollo',
      nota: 'En producción, esto redigiría a Stripe Checkout',
    });
  } catch (error) {
    console.error('Error al crear checkout:', error);
    res.status(500).json({
      error: 'Error al crear el checkout',
    });
  }
};

/**
 * Simular pago exitoso (solo para desarrollo)
 * En producción, esto sería manejado por el webhook de Stripe
 */
exports.simularPago = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { monto, usuario_id } = req.query;

    if (!monto || !usuario_id) {
      await transaction.rollback();
      return res.status(400).json({
        error: 'Faltan parámetros',
      });
    }

    const usuario = await Usuario.findByPk(usuario_id, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!usuario) {
      await transaction.rollback();
      return res.status(404).json({
        error: 'Usuario no encontrado',
      });
    }

    const saldoAnterior = parseFloat(usuario.saldo);
    const nuevoSaldo = saldoAnterior + parseFloat(monto);

    await usuario.update({ saldo: nuevoSaldo }, { transaction });

    await Transaccion.create(
      {
        usuario_id: usuario_id,
        tipo: 'recarga',
        monto: monto,
        saldo_anterior: saldoAnterior,
        saldo_nuevo: nuevoSaldo,
        descripcion: 'Recarga simulada (desarrollo)',
        metodo_pago: 'tarjeta_simulada',
        estado: 'completada',
      },
      { transaction }
    );

    await transaction.commit();

    // Redirigir al frontend
    res.redirect(
      `${process.env.CORS_ORIGIN || 'http://localhost:3000'}/recarga/exitosa?monto=${monto}&saldo=${nuevoSaldo}`
    );
  } catch (error) {
    await transaction.rollback();
    console.error('Error al simular pago:', error);
    res.status(500).json({
      error: 'Error al simular el pago',
    });
  }
};

/**
 * Webhook de Stripe (para producción)
 * Este endpoint recibiría las notificaciones de Stripe
 */
exports.webhookStripe = async (req, res) => {
  try {
    // EN PRODUCCIÓN: Verificar firma de Stripe
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    // const sig = req.headers['stripe-signature'];
    // const event = stripe.webhooks.constructEvent(
    //   req.body,
    //   sig,
    //   process.env.STRIPE_WEBHOOK_SECRET
    // );

    // switch (event.type) {
    //   case 'checkout.session.completed':
    //     const session = event.data.object;
    //     await procesarPagoExitoso(session);
    //     break;
    //   case 'payment_intent.succeeded':
    //     // Manejar pago exitoso
    //     break;
    //   default:
    //     console.log(`Evento no manejado: ${event.type}`);
    // }

    res.json({ received: true });
  } catch (error) {
    console.error('Error en webhook:', error);
    res.status(400).json({ error: 'Error en webhook' });
  }
};

/**
 * Obtener historial de recargas del usuario
 */
exports.obtenerHistorial = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { limit = 10, offset = 0 } = req.query;

    const recargas = await Transaccion.findAll({
      where: {
        usuario_id: usuarioId,
        tipo: 'recarga',
      },
      order: [['creado_en', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    const total = await Transaccion.count({
      where: {
        usuario_id: usuarioId,
        tipo: 'recarga',
      },
    });

    res.json({
      recargas: recargas.map((r) => ({
        id: r.id,
        monto: parseFloat(r.monto),
        metodo_pago: r.metodo_pago,
        fecha: r.creado_en,
        estado: r.estado,
      })),
      total,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  } catch (error) {
    console.error('Error al obtener historial:', error);
    res.status(500).json({
      error: 'Error al obtener el historial',
    });
  }
};
