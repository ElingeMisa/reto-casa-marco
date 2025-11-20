const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { recargarSaldo, obtenerHistorial } = require('../controllers/saldoController');
const { verificarToken } = require('../middleware/auth');

// Validaciones para recarga
const validacionRecarga = [
  body('monto')
    .isFloat({ min: 0.01, max: 10000 })
    .withMessage('El monto debe estar entre $0.01 y $10,000'),
  body('metodo_pago')
    .optional()
    .isIn(['tarjeta', 'transferencia', 'efectivo'])
    .withMessage('Método de pago no válido'),
];

// Rutas (todas requieren autenticación)
router.post('/recargar', verificarToken, validacionRecarga, recargarSaldo);
router.get('/historial', verificarToken, obtenerHistorial);

module.exports = router;
