import React, { useState } from 'react';
import '../styles/Exposiciones.css';

const Exposiciones: React.FC = () => {
  const [modalActivo, setModalActivo] = useState(false);
  const [tourActual, setTourActual] = useState('');

  const abrirTourVirtual = (tour: string) => {
    setTourActual(tour);
    setModalActivo(true);
  };

  const cerrarModal = () => {
    setModalActivo(false);
  };

  return (
    <div className="exposiciones">
      {/* Encabezado de Página */}
      <section className="page-header">
        <div className="container">
          <h1>Exposiciones Actuales</h1>
          <p>Explora nuestras colecciones curadas y exhibiciones especiales</p>
        </div>
      </section>

      {/* Contenido de Exposiciones */}
      <section className="exhibitions-content">
        <div className="container">
          {/* Exposición Renacimiento */}
          <div className="exhibition-detail" id="renacimiento">
            <div className="exhibition-detail-grid">
              <div
                className="exhibition-detail-image"
                style={{
                  backgroundImage:
                    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              >
                <span className="exhibition-badge">Actual</span>
              </div>
              <div className="exhibition-detail-content">
                <h2>Maestros del Renacimiento</h2>
                <p className="exhibition-meta">
                  15 de enero - 30 de junio, 2025 | Galería A
                </p>
                <p>
                  Adéntrate en el mundo del arte renacentista y sé testigo de
                  las obras maestras que definieron una era. Esta exposición
                  presenta obras de las mentes más grandes del período
                  renacentista, incluyendo Leonardo da Vinci, Miguel Ángel y
                  Rafael.
                </p>
                <h4>Destacados:</h4>
                <ul>
                  <li>Bocetos y estudios científicos de Leonardo</li>
                  <li>Diseños escultóricos de Miguel Ángel</li>
                  <li>Colección de retratos de Rafael</li>
                  <li>Línea de tiempo interactiva de innovaciones renacentistas</li>
                </ul>
                <button
                  className="btn btn-primary virtual-tour-btn"
                  onClick={() => abrirTourVirtual('renacimiento')}
                >
                  Iniciar Tour Virtual
                </button>
              </div>
            </div>
          </div>

          {/* Exposición Moderna */}
          <div className="exhibition-detail" id="moderno">
            <div className="exhibition-detail-grid">
              <div
                className="exhibition-detail-image"
                style={{
                  backgroundImage:
                    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                }}
              >
                <span className="exhibition-badge">Destacada</span>
              </div>
              <div className="exhibition-detail-content">
                <h2>Impresiones Modernas</h2>
                <p className="exhibition-meta">
                  1 de marzo - 15 de agosto, 2025 | Galería B
                </p>
                <p>
                  Descubre el movimiento artístico revolucionario que rompió con
                  las técnicas tradicionales y capturó momentos fugaces de luz y
                  color. Experimenta obras de Monet, Renoir, Degas y otros
                  pioneros impresionistas.
                </p>
                <h4>Destacados:</h4>
                <ul>
                  <li>Serie de Nenúfares de Monet</li>
                  <li>Retratos y paisajes de Renoir</li>
                  <li>Estudios de bailarinas de Degas</li>
                  <li>Demostraciones interactivas de teoría del color</li>
                </ul>
                <button
                  className="btn btn-primary virtual-tour-btn"
                  onClick={() => abrirTourVirtual('moderno')}
                >
                  Iniciar Tour Virtual
                </button>
              </div>
            </div>
          </div>

          {/* Exposición Antiguo */}
          <div className="exhibition-detail" id="antiguo">
            <div className="exhibition-detail-grid">
              <div
                className="exhibition-detail-image"
                style={{
                  backgroundImage:
                    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                }}
              >
                <span className="exhibition-badge">Nueva</span>
              </div>
              <div className="exhibition-detail-content">
                <h2>Civilizaciones Antiguas</h2>
                <p className="exhibition-meta">
                  10 de abril - 30 de octubre, 2025 | Galería C
                </p>
                <p>
                  Viaja a través del tiempo para explorar los artefactos y
                  tesoros del antiguo Egipto, Grecia, Roma y Mesopotamia. Observa
                  cómo estas civilizaciones sentaron las bases de la sociedad
                  moderna.
                </p>
                <h4>Destacados:</h4>
                <ul>
                  <li>Momias egipcias y jeroglíficos</li>
                  <li>Cerámica y esculturas griegas</li>
                  <li>Modelos de arquitectura romana</li>
                  <li>Tablillas cuneiformes mesopotámicas</li>
                </ul>
                <button
                  className="btn btn-primary virtual-tour-btn"
                  onClick={() => abrirTourVirtual('antiguo')}
                >
                  Iniciar Tour Virtual
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal de Tour Virtual */}
      {modalActivo && (
        <div className="modal active">
          <div className="modal-content">
            <span className="close-modal" onClick={cerrarModal}>
              &times;
            </span>
            <h2>Tour Virtual - {tourActual}</h2>
            <div className="tour-viewer">
              <p>Cargando experiencia de tour virtual...</p>
              <div className="tour-navigation">
                <button className="btn btn-secondary">← Anterior</button>
                <span>1 / 8</span>
                <button className="btn btn-secondary">Siguiente →</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Exposiciones;
