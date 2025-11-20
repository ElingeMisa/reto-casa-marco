import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/RecargaSaldo.css';

const MONTOS_RAPIDOS = [50, 100, 200, 500, 1000];

const RecargaSaldo: React.FC = () => {
  const { usuario, actualizarSaldo } = useAuth();
  const navigate = useNavigate();
  const [montoSeleccionado, setMontoSeleccionado] = useState<number | null>(null);
  const [montoCustom, setMontoCustom] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [metodoPago, setMetodoPago] = useState<'tarjeta' | 'paypal'>('tarjeta');

  const montoFinal = montoSeleccionado || parseFloat(montoCustom) || 0;

  const handleRecarga = async () => {
    setError('');

    if (!usuario) {
      setError('Debes iniciar sesión para recargar saldo');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    if (montoFinal <= 0) {
      setError('Ingresa un monto válido');
      return;
    }

    if (montoFinal > 10000) {
      setError('El monto máximo es $10,000');
      return;
    }

    setLoading(true);

    try {
      // En desarrollo, usamos el endpoint de simulación
      const response = await api.post<{
        mensaje: string;
        transaccion: {
          id: number;
          monto: number;
          saldo_nuevo: number;
          fecha: string;
        };
      }>('/recargas', {
        monto: montoFinal,
        metodo_pago: metodoPago,
      });

      actualizarSaldo(response.transaccion.saldo_nuevo);

      // Redirigir a página de éxito
      navigate(`/recarga/exitosa?monto=${montoFinal}&saldo=${response.transaccion.saldo_nuevo}`);
    } catch (err: any) {
      const mensaje = err.response?.data?.error || 'Error al procesar la recarga';
      setError(mensaje);
      setLoading(false);
    }
  };

  return (
    <div className="recarga-saldo-page">
      <div className="container">
        <div className="recarga-saldo-card">
          <div className="card-header">
            <h1>💳 Recargar Saldo</h1>
            <p>Agrega fondos a tu cuenta de forma rápida y segura</p>
          </div>

          {usuario && (
            <div className="saldo-actual">
              <span>Saldo actual:</span>
              <strong>${Number(usuario.saldo).toFixed(2)}</strong>
            </div>
          )}

          {error && (
            <div className="message error-message">
              <span>❌</span>
              <p>{error}</p>
            </div>
          )}

          <div className="recarga-form">
            <div className="section">
              <h3>Selecciona el monto</h3>
              <div className="montos-rapidos">
                {MONTOS_RAPIDOS.map((monto) => (
                  <button
                    key={monto}
                    className={`monto-btn ${montoSeleccionado === monto ? 'selected' : ''}`}
                    onClick={() => {
                      setMontoSeleccionado(monto);
                      setMontoCustom('');
                    }}
                    disabled={loading}
                  >
                    ${monto}
                  </button>
                ))}
              </div>

              <div className="divider">
                <span>o ingresa un monto personalizado</span>
              </div>

              <div className="monto-custom">
                <div className="input-group">
                  <span className="currency">$</span>
                  <input
                    type="number"
                    value={montoCustom}
                    onChange={(e) => {
                      setMontoCustom(e.target.value);
                      setMontoSeleccionado(null);
                    }}
                    placeholder="0.00"
                    min="1"
                    max="10000"
                    step="0.01"
                    disabled={loading}
                  />
                </div>
                <small>Monto mínimo: $1 | Máximo: $10,000</small>
              </div>
            </div>

            {montoFinal > 0 && (
              <>
                <div className="section">
                  <h3>Método de pago</h3>
                  <div className="metodos-pago">
                    <label className={`metodo ${metodoPago === 'tarjeta' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="metodo"
                        value="tarjeta"
                        checked={metodoPago === 'tarjeta'}
                        onChange={(e) => setMetodoPago(e.target.value as 'tarjeta')}
                        disabled={loading}
                      />
                      <div className="metodo-content">
                        <span className="icon">💳</span>
                        <span className="name">Tarjeta de Crédito/Débito</span>
                      </div>
                    </label>

                    <label className={`metodo ${metodoPago === 'paypal' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="metodo"
                        value="paypal"
                        checked={metodoPago === 'paypal'}
                        onChange={(e) => setMetodoPago(e.target.value as 'paypal')}
                        disabled={loading}
                      />
                      <div className="metodo-content">
                        <span className="icon">💰</span>
                        <span className="name">PayPal</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="section resumen">
                  <h3>Resumen</h3>
                  <div className="resumen-item">
                    <span>Monto a recargar:</span>
                    <strong>${montoFinal.toFixed(2)}</strong>
                  </div>
                  <div className="resumen-item">
                    <span>Saldo actual:</span>
                    <span>${usuario ? Number(usuario.saldo).toFixed(2) : '0.00'}</span>
                  </div>
                  <div className="resumen-item total">
                    <span>Nuevo saldo:</span>
                    <strong className="highlight">
                      ${usuario ? (Number(usuario.saldo) + montoFinal).toFixed(2) : montoFinal.toFixed(2)}
                    </strong>
                  </div>
                </div>

                <button
                  className="submit-btn"
                  onClick={handleRecarga}
                  disabled={loading || !usuario}
                >
                  {loading ? 'Procesando...' : `Recargar $${montoFinal.toFixed(2)}`}
                </button>

                <div className="security-note">
                  <span>🔒</span>
                  <p>Pago seguro y cifrado. En desarrollo, la recarga se aplicará automáticamente.</p>
                </div>
              </>
            )}
          </div>

          <div className="info-section">
            <h3>💡 Información importante</h3>
            <ul>
              <li>Las recargas se acreditan de forma inmediata</li>
              <li>El saldo no tiene fecha de vencimiento</li>
              <li>Puedes usar tu saldo para comprar boletos y reservas</li>
              <li>Las transacciones son seguras y encriptadas</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecargaSaldo;
