const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { crearOrden, obtenerOrdenes } = require('../controllers/ordenController');
const { verificarToken } = require('../middleware/auth');

// Validaciones para crear orden
const validacionOrden = [
  body('tipo_orden')
    .isIn(['evento', 'membresia', 'donacion'])
    .withMessage('Tipo de orden no válido'),
  body('total')
    .isFloat({ min: 0.01 })
    .withMessage('El total debe ser mayor a $0.01'),
  body('detalles')
    .isObject()
    .withMessage('Los detalles deben ser un objeto'),
  body('fecha_evento')
    .optional()
    .isISO8601()
    .withMessage('Fecha de evento inválida'),
];

// Rutas (todas requieren autenticación)
router.post('/', verificarToken, validacionOrden, crearOrden);
router.get('/', verificarToken, obtenerOrdenes);

module.exports = router;
