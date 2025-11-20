import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import '../styles/Visita.css';

const PRECIOS = {
  adultos: 15,
  niños: 0,
  estudiantes: 10,
  adultosMayores: 12,
};

const Visita: React.FC = () => {
  const navigate = useNavigate();
  const { usuario, actualizarSaldo } = useAuth();

  const [adultos, setAdultos] = useState(1);
  const [niños, setNiños] = useState(0);
  const [estudiantes, setEstudiantes] = useState(0);
  const [adultosMayores, setAdultosMayores] = useState(0);
  const [fechaEvento, setFechaEvento] = useState('');
  const [horaEvento, setHoraEvento] = useState('10:00');
  const [total, setTotal] = useState(15);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');


  useEffect(() => {
    const nuevoTotal =
      adultos * PRECIOS.adultos +
      niños * PRECIOS.niños +
      estudiantes * PRECIOS.estudiantes +
      adultosMayores * PRECIOS.adultosMayores;
    setTotal(nuevoTotal);
  }, [adultos, niños, estudiantes, adultosMayores]);

  const manejarCompra = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!usuario) {
      setError('Debes iniciar sesión para realizar una compra');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    if (total === 0) {
      setError('Debes seleccionar al menos un boleto');
      return;
    }

    if (usuario.saldo < total) {
      setError(`Saldo insuficiente. Tu saldo actual es $${usuario.saldo.toFixed(2)}. Necesitas recargar $${(total - usuario.saldo).toFixed(2)} más.`);
      return;
    }

    if (!fechaEvento) {
      setError('Debes seleccionar una fecha para tu visita');
      return;
    }

    setLoading(true);

    try {
      const detalles = {
        adultos,
        niños,
        estudiantes,
        adultosMayores,
        fecha: fechaEvento,
        hora: horaEvento,
      };

      const response = await api.post<{
        mensaje: string;
        orden: any;
        saldo_actual: number;
      }>('/ordenes', {
        tipo_orden: 'evento',
        total,
        detalles,
        fecha_evento: `${fechaEvento}T${horaEvento}:00`,
      });

      actualizarSaldo(response.saldo_actual);
      setSuccess(`¡Compra realizada con éxito! Tu nuevo saldo es $${response.saldo_actual.toFixed(2)}`);

      // Reset form
      setAdultos(1);
      setNiños(0);
      setEstudiantes(0);
      setAdultosMayores(0);
      setFechaEvento('');
      setHoraEvento('10:00');
    } catch (err: any) {
      const mensaje = err.response?.data?.error || 'Error al realizar la compra';
      setError(mensaje);
    } finally {
      setLoading(false);
    }
  };

  const hoy = new Date().toISOString().split('T')[0];

  return (
    <div className="visita">
      {/* Encabezado de Página */}
      <section className="page-header">
        <div className="container">
          <h1>Planea tu Visita</h1>
          <p>Todo lo que necesitas saber antes de visitar el Museo MARCO</p>
        </div>
      </section>

      {/* Información de Visita */}
      <section className="visit-info">
        <div className="container">
          <div className="visit-grid">
            {/* Horarios y Admisión */}
            <div className="visit-card">
              <h2>Horarios y Admisión</h2>
              <div className="visit-details">
                <h3>Horarios de Apertura</h3>
                <ul>
                  <li>
                    <strong>Lunes - Viernes:</strong> 9:00 AM - 6:00 PM
                  </li>
                  <li>
                    <strong>Sábado - Domingo:</strong> 10:00 AM - 7:00 PM
                  </li>
                  <li>
                    <strong>Cerrado:</strong> Días festivos principales
                  </li>
                </ul>

                <h3>Precios de Admisión</h3>
                <ul>
                  <li>
                    <strong>Adultos:</strong> ${PRECIOS.adultos}
                  </li>
                  <li>
                    <strong>Estudiantes:</strong> ${PRECIOS.estudiantes} (con credencial)
                  </li>
                  <li>
                    <strong>Adultos Mayores:</strong> ${PRECIOS.adultosMayores}
                  </li>
                  <li>
                    <strong>Niños (menores de 12):</strong> Gratis
                  </li>
                </ul>
              </div>
            </div>

            {/* Cómo Llegar */}
            <div className="visit-card">
              <h2>Cómo Llegar</h2>
              <div className="visit-details">
                <h3>Dirección</h3>
                <p>Av. Zuazua y Calle Jardín, Centro, Monterrey, N.L.</p>

                <h3>Estacionamiento</h3>
                <p>Estacionamiento disponible con tarifa especial para visitantes del museo.</p>

                <h3>Transporte Público</h3>
                <ul>
                  <li>Metro Línea 1 y 2 - Estación Zaragoza</li>
                  <li>Autobús: Rutas que pasan por el Centro</li>
                </ul>
              </div>
            </div>

            {/* Normas del Museo */}
            <div className="visit-card">
              <h2>Normas del Museo</h2>
              <div className="visit-details">
                <ul>
                  <li>No se permite comida o bebida dentro del museo</li>
                  <li>Flash fotográfico prohibido</li>
                  <li>Hablar en voz baja</li>
                  <li>No tocar las obras de arte</li>
                  <li>Guardar mochilas grandes en el guardarropa</li>
                </ul>
              </div>
            </div>

            {/* Accesibilidad */}
            <div className="visit-card">
              <h2>Accesibilidad</h2>
              <div className="visit-details">
                <ul>
                  <li>Rampas para sillas de ruedas</li>
                  <li>Elevadores disponibles</li>
                  <li>Baños adaptados</li>
                  <li>Tours accesibles disponibles con reserva</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Formulario de Reserva */}
      <section className="booking">
        <div className="container">
          <h2>Compra tus Boletos</h2>
          {usuario && (
            <div className="user-balance-info">
              <p>Tu saldo actual: <strong>${usuario.saldo.toFixed(2)}</strong></p>
            </div>
          )}

          {!usuario && (
            <div className="login-prompt">
              <p>Debes <a href="/login">iniciar sesión</a> o <a href="/registro">registrarte</a> para comprar boletos</p>
            </div>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {success && (
            <div className="success-message">
              {success}
            </div>
          )}

          <form onSubmit={manejarCompra} className="booking-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fechaEvento">Fecha de Visita *</label>
                <input
                  type="date"
                  id="fechaEvento"
                  value={fechaEvento}
                  onChange={(e) => setFechaEvento(e.target.value)}
                  min={hoy}
                  required
                  disabled={loading || !usuario}
                />
              </div>

              <div className="form-group">
                <label htmlFor="horaEvento">Hora de Visita *</label>
                <select
                  id="horaEvento"
                  value={horaEvento}
                  onChange={(e) => setHoraEvento(e.target.value)}
                  required
                  disabled={loading || !usuario}
                >
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="13:00">1:00 PM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="15:00">3:00 PM</option>
                  <option value="16:00">4:00 PM</option>
                  <option value="17:00">5:00 PM</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="adultos">Adultos (${PRECIOS.adultos} c/u)</label>
                <input
                  type="number"
                  id="adultos"
                  value={adultos}
                  onChange={(e) => setAdultos(Math.max(0, parseInt(e.target.value) || 0))}
                  min="0"
                  disabled={loading || !usuario}
                />
              </div>

              <div className="form-group">
                <label htmlFor="estudiantes">
                  Estudiantes (${PRECIOS.estudiantes} c/u)
                </label>
                <input
                  type="number"
                  id="estudiantes"
                  value={estudiantes}
                  onChange={(e) => setEstudiantes(Math.max(0, parseInt(e.target.value) || 0))}
                  min="0"
                  disabled={loading || !usuario}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="adultosMayores">
                  Adultos Mayores (${PRECIOS.adultosMayores} c/u)
                </label>
                <input
                  type="number"
                  id="adultosMayores"
                  value={adultosMayores}
                  onChange={(e) => setAdultosMayores(Math.max(0, parseInt(e.target.value) || 0))}
                  min="0"
                  disabled={loading || !usuario}
                />
              </div>

              <div className="form-group">
                <label htmlFor="niños">Niños (Gratis)</label>
                <input
                  type="number"
                  id="niños"
                  value={niños}
                  onChange={(e) => setNiños(Math.max(0, parseInt(e.target.value) || 0))}
                  min="0"
                  disabled={loading || !usuario}
                />
              </div>
            </div>

            <div className="total-section">
              <h3>Total: ${total.toFixed(2)}</h3>
              {usuario && usuario.saldo < total && (
                <p className="insufficient-balance">
                  Saldo insuficiente. Necesitas ${ (total - usuario.saldo).toFixed(2)} más
                </p>
              )}
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={loading || !usuario || (usuario && usuario.saldo < total)}
            >
              {loading ? 'Procesando...' : 'Comprar Boletos'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Visita;
