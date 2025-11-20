import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import '../styles/RecargaExitosa.css';

const RecargaExitosa: React.FC = () => {
  const [searchParams] = useSearchParams();
  const monto = searchParams.get('monto') || '0';
  const saldo = searchParams.get('saldo') || '0';

  useEffect(() => {
    // Confetti animation (opcional)
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      if (Date.now() > end) return;

      // Simple confetti effect
      const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.backgroundColor = randomColor;
      confetti.style.animationDuration = (Math.random() * 2 + 1) + 's';
      document.body.appendChild(confetti);

      setTimeout(() => confetti.remove(), 3000);

      requestAnimationFrame(frame);
    };

    frame();
  }, []);

  return (
    <div className="recarga-exitosa-page">
      <div className="container">
        <div className="success-card">
          <div className="success-icon">
            <div className="checkmark">✓</div>
          </div>

          <h1>¡Recarga Exitosa!</h1>
          <p className="subtitle">Tu saldo ha sido actualizado correctamente</p>

          <div className="details">
            <div className="detail-item">
              <span className="label">Monto recargado:</span>
              <span className="value">${parseFloat(monto).toFixed(2)}</span>
            </div>
            <div className="detail-item total">
              <span className="label">Tu nuevo saldo:</span>
              <span className="value highlight">${parseFloat(saldo).toFixed(2)}</span>
            </div>
          </div>

          <div className="actions">
            <Link to="/visita" className="btn btn-primary">
              Comprar Boletos
            </Link>
            <Link to="/exposiciones" className="btn btn-secondary">
              Ver Exposiciones
            </Link>
            <Link to="/" className="btn btn-text">
              Volver al Inicio
            </Link>
          </div>

          <div className="next-steps">
            <h3>¿Qué puedes hacer ahora?</h3>
            <ul>
              <li>✅ Comprar boletos para visitar el museo</li>
              <li>✅ Adquirir entradas para exposiciones especiales</li>
              <li>✅ Reservar tours virtuales</li>
              <li>✅ Canjear más códigos promocionales</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecargaExitosa;
