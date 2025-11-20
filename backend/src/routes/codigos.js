const express = require('express');
const router = express.Router();
const codigosController = require('../controllers/codigosController');
const auth = require('../middleware/auth');

/**
 * @route   POST /api/v1/codigos/canjear
 * @desc    Canjear un código promocional
 * @access  Private
 */
router.post('/canjear', auth, codigosController.canjearCodigo);

/**
 * @route   GET /api/v1/codigos/verificar/:codigo
 * @desc    Verificar si un código es válido (sin canjearlo)
 * @access  Private
 */
router.get('/verificar/:codigo', auth, codigosController.verificarCodigo);

/**
 * @route   GET /api/v1/codigos
 * @desc    Obtener todos los códigos (solo admin)
 * @access  Private (Admin)
 */
router.get('/', auth, codigosController.obtenerCodigos);

/**
 * @route   POST /api/v1/codigos
 * @desc    Crear nuevo código promocional (solo admin)
 * @access  Private (Admin)
 */
router.post('/', auth, codigosController.crearCodigo);

module.exports = router;
