const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { Usuario } = require('../models');
const { sequelize } = require('../config/database');

// Generar JWT
const generarToken = (usuario) => {
  return jwt.sign(
    {
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

// Registro de usuario
const registro = async (req, res) => {
  try {
    // Validar entrada
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({
        error: 'Datos inválidos',
        detalles: errores.array(),
      });
    }

    const { nombre, email, password } = req.body;

    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(409).json({
        error: 'Conflicto',
        mensaje: 'El correo electrónico ya está registrado',
      });
    }

    // Crear usuario (el password se hasheará automáticamente en el hook)
    const nuevoUsuario = await Usuario.create({
      nombre,
      email,
      password,
      saldo: 0.00,
      rol: 'usuario',
    });

    // Generar token
    const token = generarToken(nuevoUsuario);

    // Responder con usuario y token
    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      usuario: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        saldo: nuevoUsuario.saldo,
        rol: nuevoUsuario.rol,
      },
      token,
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      mensaje: 'No se pudo completar el registro',
    });
  }
};

// Login de usuario
const login = async (req, res) => {
  try {
    // Validar entrada
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({
        error: 'Datos inválidos',
        detalles: errores.array(),
      });
    }

    const { email, password } = req.body;

    // Buscar usuario
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(401).json({
        error: 'Credenciales inválidas',
        mensaje: 'Correo o contraseña incorrectos',
      });
    }

    // Verificar si el usuario está activo
    if (!usuario.activo) {
      return res.status(403).json({
        error: 'Acceso denegado',
        mensaje: 'Cuenta desactivada',
      });
    }

    // Validar password
    const passwordValido = await usuario.validarPassword(password);

    if (!passwordValido) {
      return res.status(401).json({
        error: 'Credenciales inválidas',
        mensaje: 'Correo o contraseña incorrectos',
      });
    }

    // Actualizar último acceso
    await usuario.update({ ultimo_acceso: new Date() });

    // Generar token
    const token = generarToken(usuario);

    res.json({
      mensaje: 'Inicio de sesión exitoso',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        saldo: parseFloat(usuario.saldo),
        rol: usuario.rol,
      },
      token,
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      mensaje: 'No se pudo completar el inicio de sesión',
    });
  }
};

// Obtener perfil del usuario autenticado
const obtenerPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id);

    res.json({
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        saldo: parseFloat(usuario.saldo),
        rol: usuario.rol,
        creado_en: usuario.creado_en,
        ultimo_acceso: usuario.ultimo_acceso,
      },
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
    });
  }
};

module.exports = {
  registro,
  login,
  obtenerPerfil,
};
