const CodigoPromocional = require('../models/CodigoPromocional');
const Usuario = require('../models/Usuario');
const Transaccion = require('../models/Transaccion');
const sequelize = require('../config/database');

/**
 * Canjear un código promocional
 */
exports.canjearCodigo = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { codigo } = req.body;
    const usuarioId = req.usuario.id;

    if (!codigo || codigo.trim() === '') {
      await transaction.rollback();
      return res.status(400).json({
        error: 'Debes proporcionar un código',
      });
    }

    // Verificar que el código existe y es válido
    const codigoPromo = await CodigoPromocional.findOne({
      where: { codigo: codigo.trim() },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!codigoPromo) {
      await transaction.rollback();
      return res.status(404).json({
        error: 'Código no encontrado',
      });
    }

    if (!codigoPromo.activo) {
      await transaction.rollback();
      return res.status(400).json({
        error: 'Este código ya no está activo',
      });
    }

    if (codigoPromo.usado_por) {
      await transaction.rollback();
      return res.status(400).json({
        error: 'Este código ya fue utilizado',
      });
    }

    if (codigoPromo.expira_en && new Date() > new Date(codigoPromo.expira_en)) {
      await transaction.rollback();
      return res.status(400).json({
        error: 'Este código ha expirado',
      });
    }

    // Obtener usuario con lock
    const usuario = await Usuario.findByPk(usuarioId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    // Actualizar saldo del usuario
    const nuevoSaldo = parseFloat(usuario.saldo) + parseFloat(codigoPromo.monto);
    await usuario.update({ saldo: nuevoSaldo }, { transaction });

    // Marcar código como usado
    await codigoPromo.update(
      {
        usado_por: usuarioId,
        fecha_uso: new Date(),
        activo: false,
      },
      { transaction }
    );

    // Registrar transacción
    await Transaccion.create(
      {
        usuario_id: usuarioId,
        tipo: 'recarga',
        monto: codigoPromo.monto,
        saldo_anterior: usuario.saldo,
        saldo_nuevo: nuevoSaldo,
        descripcion: `Código promocional canjeado: ${codigo}`,
        metodo_pago: 'codigo_promocional',
        estado: 'completada',
      },
      { transaction }
    );

    await transaction.commit();

    res.json({
      mensaje: `¡Código canjeado exitosamente! Se agregaron $${parseFloat(codigoPromo.monto).toFixed(2)} a tu cuenta`,
      monto: parseFloat(codigoPromo.monto),
      saldo_nuevo: parseFloat(nuevoSaldo),
      codigo: codigo,
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al canjear código:', error);
    res.status(500).json({
      error: error.message || 'Error al canjear el código',
    });
  }
};

/**
 * Verificar si un código es válido (sin canjearlo)
 */
exports.verificarCodigo = async (req, res) => {
  try {
    const { codigo } = req.params;

    const codigoPromo = await CodigoPromocional.findOne({
      where: { codigo },
    });

    if (!codigoPromo) {
      return res.status(404).json({
        valido: false,
        mensaje: 'Código no encontrado',
      });
    }

    if (!codigoPromo.activo || codigoPromo.usado_por) {
      return res.json({
        valido: false,
        mensaje: 'Este código ya no está disponible',
      });
    }

    if (codigoPromo.expira_en && new Date() > new Date(codigoPromo.expira_en)) {
      return res.json({
        valido: false,
        mensaje: 'Este código ha expirado',
      });
    }

    res.json({
      valido: true,
      monto: parseFloat(codigoPromo.monto),
      descripcion: codigoPromo.descripcion,
    });
  } catch (error) {
    console.error('Error al verificar código:', error);
    res.status(500).json({
      error: 'Error al verificar el código',
    });
  }
};

/**
 * Obtener códigos disponibles (solo admin)
 */
exports.obtenerCodigos = async (req, res) => {
  try {
    const codigos = await CodigoPromocional.findAll({
      attributes: ['id', 'codigo', 'monto', 'activo', 'descripcion', 'expira_en', 'creado_en'],
      order: [['creado_en', 'DESC']],
    });

    res.json({ codigos });
  } catch (error) {
    console.error('Error al obtener códigos:', error);
    res.status(500).json({
      error: 'Error al obtener códigos',
    });
  }
};

/**
 * Crear nuevo código promocional (solo admin)
 */
exports.crearCodigo = async (req, res) => {
  try {
    const { codigo, monto, descripcion, expira_en } = req.body;

    if (!codigo || !monto) {
      return res.status(400).json({
        error: 'Código y monto son requeridos',
      });
    }

    const codigoExistente = await CodigoPromocional.findOne({
      where: { codigo },
    });

    if (codigoExistente) {
      return res.status(400).json({
        error: 'Este código ya existe',
      });
    }

    const nuevoCodigo = await CodigoPromocional.create({
      codigo,
      monto,
      descripcion,
      expira_en: expira_en || null,
    });

    res.status(201).json({
      mensaje: 'Código creado exitosamente',
      codigo: nuevoCodigo,
    });
  } catch (error) {
    console.error('Error al crear código:', error);
    res.status(500).json({
      error: 'Error al crear el código',
    });
  }
};
