const express = require('express');
const router = express.Router();
const recargasController = require('../controllers/recargasController');
const auth = require('../middleware/auth');

/**
 * @route   POST /api/v1/recargas
 * @desc    Crear una recarga de saldo (simulada)
 * @access  Private
 */
router.post('/', auth, recargasController.crearRecarga);

/**
 * @route   POST /api/v1/recargas/checkout
 * @desc    Crear sesión de Stripe Checkout
 * @access  Private
 */
router.post('/checkout', auth, recargasController.crearCheckoutStripe);

/**
 * @route   GET /api/v1/recargas/simular
 * @desc    Simular pago exitoso (solo desarrollo)
 * @access  Public (solo para desarrollo)
 */
router.get('/simular', recargasController.simularPago);

/**
 * @route   POST /api/v1/recargas/webhook
 * @desc    Webhook de Stripe para notificaciones de pago
 * @access  Public (validado por firma de Stripe)
 */
router.post('/webhook', express.raw({ type: 'application/json' }), recargasController.webhookStripe);

/**
 * @route   GET /api/v1/recargas/historial
 * @desc    Obtener historial de recargas del usuario
 * @access  Private
 */
router.get('/historial', auth, recargasController.obtenerHistorial);

module.exports = router;
