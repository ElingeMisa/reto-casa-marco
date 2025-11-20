import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/CanjearCodigo.css';

const CanjearCodigo: React.FC = () => {
  const { usuario, actualizarSaldo } = useAuth();
  const navigate = useNavigate();
  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!usuario) {
      setError('Debes iniciar sesión para canjear códigos');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    if (!codigo.trim()) {
      setError('Por favor ingresa un código');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post<{
        mensaje: string;
        monto: number;
        saldo_nuevo: number;
        codigo: string;
      }>('/codigos/canjear', {
        codigo: codigo.trim(),
      });

      actualizarSaldo(response.saldo_nuevo);
      setSuccess(response.mensaje);
      setCodigo('');

      // Redirigir después de 3 segundos
      setTimeout(() => navigate('/'), 3000);
    } catch (err: any) {
      const mensaje = err.response?.data?.error || 'Error al canjear el código';
      setError(mensaje);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="canjear-codigo-page">
      <div className="container">
        <div className="canjear-codigo-card">
          <div className="card-header">
            <h1>🎁 Canjear Código Promocional</h1>
            <p>Ingresa tu código para recibir saldo gratis</p>
          </div>

          {usuario && (
            <div className="saldo-actual">
              <span>Tu saldo actual:</span>
              <strong>${Number(usuario.saldo).toFixed(2)}</strong>
            </div>
          )}

          {error && (
            <div className="message error-message">
              <span>❌</span>
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="message success-message">
              <span>✅</span>
              <p>{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="canjear-codigo-form">
            <div className="form-group">
              <label htmlFor="codigo">Código Promocional</label>
              <input
                type="text"
                id="codigo"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                placeholder="Ej: MARCO50"
                disabled={loading || !usuario}
                maxLength={50}
                autoFocus
              />
              <small>Los códigos distinguen entre mayúsculas y minúsculas</small>
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={loading || !usuario || !codigo.trim()}
            >
              {loading ? 'Canjeando...' : 'Canjear Código'}
            </button>
          </form>

          <div className="info-section">
            <h3>💡 ¿Dónde conseguir códigos?</h3>
            <ul>
              <li>Síguenos en redes sociales para códigos exclusivos</li>
              <li>Suscríbete a nuestro newsletter</li>
              <li>Participa en eventos del museo</li>
              <li>Promociones especiales durante festividades</li>
            </ul>
          </div>

          <div className="codigos-ejemplo">
            <h3>Códigos disponibles (para prueba):</h3>
            <div className="codigos-grid">
              <div className="codigo-item">
                <code>Ko4l4ps0</code>
                <span>$500</span>
              </div>
              <div className="codigo-item">
                <code>WELCOME100</code>
                <span>$100</span>
              </div>
              <div className="codigo-item">
                <code>MARCO50</code>
                <span>$50</span>
              </div>
              <div className="codigo-item">
                <code>MUSEUM25</code>
                <span>$25</span>
              </div>
              <div className="codigo-item">
                <code>ART200</code>
                <span>$200</span>
              </div>
              <div className="codigo-item">
                <code>CULTURA75</code>
                <span>$75</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CanjearCodigo;
