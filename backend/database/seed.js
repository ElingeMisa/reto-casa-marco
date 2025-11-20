/**
 * Script para poblar la base de datos con datos de prueba
 * Ejecutar con: node database/seed.js
 */

const { sequelize } = require('../src/config/database');
const { Usuario } = require('../src/models');

const seed = async () => {
  try {
    console.log('🌱 Poblando base de datos con datos de prueba...\n');

    await sequelize.authenticate();

    // Crear usuarios de prueba
    console.log('👤 Creando usuarios de prueba...');

    const usuarios = await Promise.all([
      Usuario.create({
        nombre: 'Usuario Demo',
        email: 'demo@museomarco.com',
        password: 'Demo12345',
        saldo: 1000.00,
        rol: 'usuario',
      }),
      Usuario.create({
        nombre: 'Admin MARCO',
        email: 'admin@museomarco.com',
        password: 'Admin12345',
        saldo: 0.00,
        rol: 'administrador',
      }),
    ]);

    console.log(`\n✅ ${usuarios.length} usuarios creados:\n`);
    usuarios.forEach(u => {
      console.log(`   - ${u.email} (${u.rol}) - Saldo: $${u.saldo}`);
    });

    console.log('\n📝 Credenciales de prueba:');
    console.log('   Usuario: demo@museomarco.com / Demo12345');
    console.log('   Admin:   admin@museomarco.com / Admin12345');

    console.log('\n🎉 ¡Datos de prueba creados exitosamente!\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error al poblar la base de datos:', error.message);
    process.exit(1);
  }
};

seed();
