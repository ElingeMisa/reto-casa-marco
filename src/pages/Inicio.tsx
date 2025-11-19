import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Inicio.css';

const Inicio: React.FC = () => {
  return (
    <div className="inicio">
      {/* Sección Hero */}
      <section className="hero">
        <div className="hero-content">
          <h2>Descubre las Maravillas del Museo</h2>
          <p>Explora nuestra colección de arte contemporáneo de clase mundial desde la comodidad de tu hogar</p>
          <Link to="/exposiciones" className="btn btn-primary">
            Explorar Exposiciones
          </Link>
        </div>
      </section>

      {/* Exposiciones Destacadas */}
      <section className="featured-exhibitions">
        <div className="container">
          <h2 className="section-title">Exposiciones Destacadas</h2>
          <div className="exhibition-grid">
            <div className="exhibition-card">
              <div
                className="exhibition-image"
                style={{
                  backgroundImage:
                    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              >
                <span className="exhibition-badge">Actual</span>
              </div>
              <div className="exhibition-info">
                <h3>Maestros del Renacimiento</h3>
                <p>
                  Viaja a través de la edad dorada del arte con obras de
                  Leonardo, Miguel Ángel y Rafael.
                </p>
                <Link to="/exposiciones#renacimiento" className="btn btn-secondary">
                  Ver Exposición
                </Link>
              </div>
            </div>

            <div className="exhibition-card">
              <div
                className="exhibition-image"
                style={{
                  backgroundImage:
                    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                }}
              >
                <span className="exhibition-badge">Destacada</span>
              </div>
              <div className="exhibition-info">
                <h3>Impresiones Modernas</h3>
                <p>
                  Experimenta el movimiento artístico revolucionario que cambió
                  el mundo de la pintura para siempre.
                </p>
                <Link to="/exposiciones#moderno" className="btn btn-secondary">
                  Ver Exposición
                </Link>
              </div>
            </div>

            <div className="exhibition-card">
              <div
                className="exhibition-image"
                style={{
                  backgroundImage:
                    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                }}
              >
                <span className="exhibition-badge">Nueva</span>
              </div>
              <div className="exhibition-info">
                <h3>Civilizaciones Antiguas</h3>
                <p>
                  Descubre artefactos y tesoros de las culturas más influyentes
                  del mundo antiguo.
                </p>
                <Link to="/exposiciones#antiguo" className="btn btn-secondary">
                  Ver Exposición
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Información Rápida */}
      <section className="quick-info">
        <div className="container">
          <div className="info-grid">
            <div className="info-card">
              <div className="info-icon">🕐</div>
              <h3>Horarios</h3>
              <p>
                Lun-Vie: 9:00 AM - 6:00 PM
                <br />
                Sáb-Dom: 10:00 AM - 7:00 PM
              </p>
            </div>
            <div className="info-card">
              <div className="info-icon">🎫</div>
              <h3>Tours Virtuales</h3>
              <p>
                Explora nuestras colecciones en línea
                <br />
                Disponibles 24/7
              </p>
            </div>
            <div className="info-card">
              <div className="info-icon">📍</div>
              <h3>Ubicación</h3>
              <p>
                Avenida del Museo 123
                <br />
                Distrito Cultural
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Inicio;
