import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Museo MARCO</h3>
            <p>Preservando la historia, inspirando el futuro.</p>
          </div>
          <div className="footer-section">
            <h4>Enlaces Rápidos</h4>
            <ul>
              <li>
                <Link to="/exposiciones">Exposiciones</Link>
              </li>
              <li>
                <Link to="/colecciones">Colecciones</Link>
              </li>
              <li>
                <Link to="/visita">Planea tu Visita</Link>
              </li>
              <li>
                <Link to="/acerca">Acerca de</Link>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contacto</h4>
            <p>
              Email: info@museomarco.com
              <br />
              Teléfono: (555) 123-4567
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Museo MARCO. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
