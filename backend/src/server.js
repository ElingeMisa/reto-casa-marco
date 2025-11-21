const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');
require('dotenv').config();

const { sequelize, testConnection } = require('./config/database');
const { helmetConfig, generalLimiter, sanitizeBody } = require('./middleware/security');
const { Usuario, CodigoPromocional } = require('./models');

// Importar rutas
const authRoutes = require('./routes/auth');
const saldoRoutes = require('./routes/saldo');
const ordenesRoutes = require('./routes/ordenes');
const codigosRoutes = require('./routes/codigos');
const recargasRoutes = require('./routes/recargas');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares de seguridad
app.use(helmetConfig);
app.use(generalLimiter);

// CORS configurado
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));

// Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Sanitización
app.use(sanitizeBody);

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Compresión
app.use(compression());

// Rutas de la API
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/saldo', saldoRoutes);
app.use('/api/v1/ordenes', ordenesRoutes);
app.use('/api/v1/codigos', codigosRoutes);
app.use('/api/v1/recargas', recargasRoutes);

// Ruta de health check
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'OK',
    mensaje: 'Museo MARCO API funcionando correctamente',
    timestamp: new Date().toISOString(),
  });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    mensaje: 'El endpoint solicitado no existe',
  });
});

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);

  // No exponer detalles del error en producción
  const errorResponse = {
    error: 'Error interno del servidor',
  };

  if (process.env.NODE_ENV === 'development') {
    errorResponse.mensaje = err.message;
    errorResponse.stack = err.stack;
  }

  res.status(err.status || 500).json(errorResponse);
});

// Función para poblar datos iniciales
const poblarDatosIniciales = async () => {
  try {
    // Verificar si ya existen códigos promocionales
    const codigosExistentes = await CodigoPromocional.count();

    if (codigosExistentes === 0) {
      console.log('📝 Poblando códigos promocionales...');
      await CodigoPromocional.bulkCreate([
        { codigo: 'Ko4l4ps0', monto: 500.00, descripcion: 'Código especial - $500' },
        { codigo: 'WELCOME100', monto: 100.00, descripcion: 'Bienvenida - $100' },
        { codigo: 'MARCO50', monto: 50.00, descripcion: 'Código promocional - $50' },
        { codigo: 'MUSEUM25', monto: 25.00, descripcion: 'Código museo - $25' },
        { codigo: 'ART200', monto: 200.00, descripcion: 'Código arte - $200' },
        { codigo: 'CULTURA75', monto: 75.00, descripcion: 'Código cultura - $75' },
      ]);
      console.log('✅ Códigos promocionales creados');
    }
  } catch (error) {
    console.error('⚠️ Error al poblar datos iniciales:', error.message);
  }
};

// Iniciar servidor
const iniciarServidor = async () => {
  try {
    // Conectar a la base de datos
    await testConnection();

    // Sincronizar modelos (solo en desarrollo)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('✅ Modelos sincronizados con la base de datos');

      // Poblar datos iniciales si no existen
      await poblarDatosIniciales();
    }

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════╗
║   🎨 Museo MARCO API Server                ║
║   🚀 Servidor corriendo en puerto ${PORT}     ║
║   🌍 Entorno: ${process.env.NODE_ENV || 'development'}              ║
║   📡 http://localhost:${PORT}                 ║
╚════════════════════════════════════════════╝
      `);
    });

  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Manejo de señales para cierre gracioso
process.on('SIGTERM', async () => {
  console.log('SIGTERM recibido. Cerrando servidor...');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT recibido. Cerrando servidor...');
  await sequelize.close();
  process.exit(0);
});

iniciarServidor();

module.exports = app;
