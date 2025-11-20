const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { registro, login, obtenerPerfil } = require('../controllers/authController');
const { verificarToken } = require('../middleware/auth');
const { loginLimiter } = require('../middleware/security');

// Validaciones para registro
const validacionRegistro = [
  body('nombre')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Debe proporcionar un correo válido'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La contraseña debe contener al menos una mayúscula, una minúscula y un número'),
];

// Validaciones para login
const validacionLogin = [
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Debe proporcionar un correo válido'),
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida'),
];

// Rutas
router.post('/registro', validacionRegistro, registro);
router.post('/login', loginLimiter, validacionLogin, login);
router.get('/perfil', verificarToken, obtenerPerfil);

module.exports = router;
