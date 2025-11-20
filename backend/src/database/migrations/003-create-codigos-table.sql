-- Tabla para códigos promocionales
CREATE TABLE IF NOT EXISTS codigos_promocionales (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    monto DECIMAL(10, 2) NOT NULL CHECK (monto > 0),
    activo BOOLEAN DEFAULT true,
    usado_por INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    fecha_uso TIMESTAMP,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expira_en TIMESTAMP,
    descripcion TEXT
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_codigo ON codigos_promocionales(codigo);
CREATE INDEX idx_activo ON codigos_promocionales(activo);
CREATE INDEX idx_usado_por ON codigos_promocionales(usado_por);

-- Insertar código especial Ko4l4ps0
INSERT INTO codigos_promocionales (codigo, monto, descripcion)
VALUES ('Ko4l4ps0', 500.00, 'Código especial de $500')
ON CONFLICT (codigo) DO NOTHING;

-- Insertar códigos aleatorios de prueba
INSERT INTO codigos_promocionales (codigo, monto, descripcion) VALUES
    ('WELCOME100', 100.00, 'Bienvenida - $100'),
    ('MARCO50', 50.00, 'Código promocional - $50'),
    ('MUSEUM25', 25.00, 'Código museo - $25'),
    ('ART200', 200.00, 'Código arte - $200'),
    ('CULTURA75', 75.00, 'Código cultura - $75')
ON CONFLICT (codigo) DO NOTHING;

COMMENT ON TABLE codigos_promocionales IS 'Códigos promocionales para obtener saldo gratis';
COMMENT ON COLUMN codigos_promocionales.codigo IS 'Código único que el usuario puede canjear';
COMMENT ON COLUMN codigos_promocionales.monto IS 'Cantidad de saldo que otorga el código';
COMMENT ON COLUMN codigos_promocionales.activo IS 'Si el código está disponible para usar';
COMMENT ON COLUMN codigos_promocionales.usado_por IS 'Usuario que canjeó el código';
COMMENT ON COLUMN codigos_promocionales.fecha_uso IS 'Fecha y hora en que se canjeó';
