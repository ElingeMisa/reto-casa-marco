/**
 * Script para crear la base de datos y las tablas iniciales
 * Ejecutar con: node database/setup.js
 */

const { sequelize } = require('../src/config/database');
const { Usuario, Transaccion, Orden } = require('../src/models');

const setup = async () => {
  try {
    console.log('🔧 Iniciando configuración de base de datos...\n');

    // Conectar a PostgreSQL
    await sequelize.authenticate();
    console.log('✅ Conexión a PostgreSQL establecida\n');

    // Crear tablas (force: true eliminará tablas existentes)
    console.log('📦 Creando tablas...');
    await sequelize.sync({ force: true });

    console.log('\n✅ Tablas creadas exitosamente:\n');
    console.log('   - usuarios');
    console.log('   - transacciones');
    console.log('   - ordenes');

    console.log('\n🎉 ¡Configuración completada!\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error durante la configuración:', error.message);
    console.error('\n💡 Asegúrate de que:');
    console.log('   1. PostgreSQL esté instalado y corriendo');
    console.log('   2. Las credenciales en .env sean correctas');
    console.log('   3. La base de datos "museo_marco" exista');
    console.log('\nPara crear la base de datos, ejecuta en PostgreSQL:');
    console.log('   CREATE DATABASE museo_marco;');
    process.exit(1);
  }
};

setup();
