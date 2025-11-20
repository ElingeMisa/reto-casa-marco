import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Navbar.css';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/');
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
          {usuario ? (
            <>
              <li className="user-info">
                <span className="user-name">{usuario.nombre}</span>
                <span className="user-balance">${usuario.saldo.toFixed(2)}</span>
              </li>
              <li>
                <button className="logout-button" onClick={handleLogout}>
                  Cerrar Sesión
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="nav-link login-link" onClick={closeMenu}>
                  Iniciar Sesión
                </Link>
              </li>
              <li>
                <Link to="/registro" className="nav-link register-link" onClick={closeMenu}>
                  Registrarse
                </Link>
              </li>
            </>
          )}
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
