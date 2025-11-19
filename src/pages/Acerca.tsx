import React from 'react';
import '../styles/Acerca.css';

const Acerca: React.FC = () => {
  return (
    <div className="acerca">
      {/* Encabezado de Página */}
      <section className="page-header">
        <div className="container">
          <h1>Acerca del Museo MARCO</h1>
          <p>Nuestra misión, historia y dedicación al arte y la cultura</p>
        </div>
      </section>

      {/* Contenido Acerca de */}
      <section className="about-content">
        <div className="container">
          <div className="about-section">
            <h2>Nuestra Historia</h2>
            <p>
              Fundado en 1985, el Museo MARCO ha sido un faro de cultura y
              educación durante más de cuatro décadas. Nuestra misión es preservar
              y compartir los tesoros artísticos e históricos del mundo con
              visitantes de todo el globo.
            </p>
            <p>
              Lo que comenzó como una pequeña colección privada ha crecido hasta
              convertirse en una de las instituciones culturales más prestigiosas
              de la región, albergando más de 50,000 artefactos y obras de arte que
              abarcan 5,000 años de historia humana.
            </p>
          </div>

          <div className="about-section">
            <h2>Nuestra Misión</h2>
            <p>El Museo MARCO está dedicado a:</p>
            <ul className="mission-list">
              <li>Preservar el patrimonio cultural para las generaciones futuras</li>
              <li>Hacer que el arte y la historia sean accesibles para todos</li>
              <li>Fomentar la educación y el entendimiento cultural</li>
              <li>Apoyar la investigación y la erudición</li>
              <li>Crear experiencias de visitante atractivas e inspiradoras</li>
            </ul>
          </div>

          <div className="about-section">
            <h2>Nuestras Colecciones</h2>
            <p>La colección permanente del museo incluye:</p>
            <div className="collections-stats">
              <div className="stat-card">
                <h3>15,000+</h3>
                <p>Pinturas y Dibujos</p>
              </div>
              <div className="stat-card">
                <h3>8,000+</h3>
                <p>Esculturas</p>
              </div>
              <div className="stat-card">
                <h3>20,000+</h3>
                <p>Artefactos Históricos</p>
              </div>
              <div className="stat-card">
                <h3>7,000+</h3>
                <p>Manuscritos y Libros</p>
              </div>
            </div>
          </div>

          <div className="about-section">
            <h2>Equipo de Liderazgo</h2>
            <div className="team-grid">
              <div className="team-member">
                <div
                  className="team-avatar"
                  style={{
                    background:
                      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  }}
                ></div>
                <h3>Dra. Sarah Martínez</h3>
                <p className="team-role">Directora</p>
                <p>
                  La Dra. Martínez aporta 25 años de experiencia en liderazgo de
                  museos, habiendo servido previamente como curadora en el
                  Museo Metropolitano.
                </p>
              </div>
              <div className="team-member">
                <div
                  className="team-avatar"
                  style={{
                    background:
                      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  }}
                ></div>
                <h3>Prof. James Chen</h3>
                <p className="team-role">Curador Principal</p>
                <p>
                  El Prof. Chen es un experto reconocido internacionalmente en
                  arte renacentista con numerosas publicaciones y exposiciones.
                </p>
              </div>
              <div className="team-member">
                <div
                  className="team-avatar"
                  style={{
                    background:
                      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  }}
                ></div>
                <h3>María Rodríguez</h3>
                <p className="team-role">Directora de Educación</p>
                <p>
                  María ha sido pionera en programas educativos innovadores en
                  museos que han llegado a más de 100,000 estudiantes.
                </p>
              </div>
              <div className="team-member">
                <div
                  className="team-avatar"
                  style={{
                    background:
                      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                  }}
                ></div>
                <h3>Dr. Robert Williams</h3>
                <p className="team-role">Director de Conservación</p>
                <p>
                  El Dr. Williams lidera nuestros esfuerzos de conservación con
                  experiencia en preservación y técnicas de restauración de arte.
                </p>
              </div>
            </div>
          </div>

          <div className="about-section">
            <h2>Apoya al Museo</h2>
            <p>
              El Museo MARCO es una organización sin fines de lucro que depende del
              generoso apoyo de donantes, miembros y voluntarios. Tu contribución
              nos ayuda a:
            </p>
            <ul className="mission-list">
              <li>Adquirir nuevas obras para nuestra colección</li>
              <li>Preservar y restaurar obras de arte existentes</li>
              <li>Desarrollar programas educativos</li>
              <li>Ofrecer admisión gratuita a comunidades desatendidas</li>
              <li>Mantener nuestras instalaciones e infraestructura</li>
            </ul>
            <div className="support-buttons">
              <button className="btn btn-primary">Hazte Miembro</button>
              <button className="btn btn-secondary">Hacer una Donación</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Acerca;
