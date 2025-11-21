-- Script de inicialización para Docker
-- Este script se ejecuta cuando el contenedor de PostgreSQL inicia

-- Insertar usuario de prueba (password: Demo12345)
-- El hash fue generado con argon2
INSERT INTO usuario (nombre, email, password, saldo, rol, activo, creado_en, actualizado_en)
VALUES (
  'Usuario Demo',
  'demo@museomarco.com',
  '$argon2id$v=19$m=65536,t=3,p=4$randomsalt$hashedpassword',
  500.00,
  'usuario',
  true,
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Insertar códigos promocionales
INSERT INTO codigos_promocionales (codigo, monto, activo, descripcion, creado_en)
VALUES
  ('Ko4l4ps0', 500.00, true, 'Código especial - $500', NOW()),
  ('WELCOME100', 100.00, true, 'Código de bienvenida - $100', NOW()),
  ('MARCO50', 50.00, true, 'Código del museo - $50', NOW()),
  ('MUSEUM25', 25.00, true, 'Descuento museo - $25', NOW()),
  ('ART200', 200.00, true, 'Arte promocional - $200', NOW()),
  ('CULTURA75', 75.00, true, 'Cultura MARCO - $75', NOW())
ON CONFLICT (codigo) DO NOTHING;
