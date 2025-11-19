import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="logo">
          <h1>Museo MARCO</h1>
        </div>
        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <li>
            <Link to="/" className="nav-link" onClick={closeMenu}>
              Inicio
            </Link>
          </li>
          <li>
            <Link to="/exposiciones" className="nav-link" onClick={closeMenu}>
              Exposiciones
            </Link>
          </li>
          <li>
            <Link to="/colecciones" className="nav-link" onClick={closeMenu}>
              Colecciones
            </Link>
          </li>
          <li>
            <Link to="/visita" className="nav-link" onClick={closeMenu}>
              Visita
            </Link>
          </li>
          <li>
            <Link to="/acerca" className="nav-link" onClick={closeMenu}>
              Acerca
            </Link>
          </li>
        </ul>
        <div
          className={`hamburger ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
