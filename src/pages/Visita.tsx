import React, { useState, useEffect } from 'react';
import '../styles/Visita.css';

const Visita: React.FC = () => {
  const [adultos, setAdultos] = useState(1);
  const [niños, setNiños] = useState(0);
  const [estudiantes, setEstudiantes] = useState(0);
  const [adultosMayores, setAdultosMayores] = useState(0);
  const [total, setTotal] = useState(15);

  const precios = {
    adultos: 15,
    niños: 0,
    estudiantes: 10,
    adultosMayores: 12,
  };

  useEffect(() => {
    const nuevoTotal =
      adultos * precios.adultos +
      niños * precios.niños +
      estudiantes * precios.estudiantes +
      adultosMayores * precios.adultosMayores;
    setTotal(nuevoTotal);
  }, [adultos, niños, estudiantes, adultosMayores]);

  const manejarEnvio = (e: React.FormEvent) => {
    e.preventDefault();
    const formulario = e.target as HTMLFormElement;
    const datos = new FormData(formulario);

    alert(`¡Gracias por tu reserva, ${datos.get('nombre')}!\n\nDetalles de la Visita:\nFecha: ${datos.get('fechaVisita')}\nHora: ${datos.get('horaVisita')}\nTotal: $${total.toFixed(2)}\n\nSe enviará un correo de confirmación a: ${datos.get('email')}`);

    formulario.reset();
    setAdultos(1);
    setNiños(0);
    setEstudiantes(0);
    setAdultosMayores(0);
  };

  // Obtener la fecha de hoy para el mínimo del input date
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
                    <strong>Adultos:</strong> $15
                  </li>
                  <li>
                    <strong>Adultos Mayores (65+):</strong> $12
                  </li>
                  <li>
                    <strong>Estudiantes:</strong> $10
                  </li>
                  <li>
                    <strong>Niños (menores de 12):</strong> Gratis
                  </li>
                  <li>
                    <strong>Pase Familiar:</strong> $40 (2 adultos + 3 niños)
                  </li>
                </ul>
              </div>
            </div>

            {/* Ubicación */}
            <div className="visit-card">
              <h2>Ubicación y Estacionamiento</h2>
              <div className="visit-details">
                <h3>Dirección</h3>
                <p>
                  Museo MARCO
                  <br />
                  Avenida del Museo 123
                  <br />
                  Distrito Cultural
                  <br />
                  Ciudad, Estado 12345
                </p>

                <h3>Estacionamiento</h3>
                <ul>
                  <li>Estacionamiento en el sitio disponible</li>
                  <li>$5 para visitantes del museo</li>
                  <li>Espacios de estacionamiento accesibles</li>
                  <li>Transporte público cercano</li>
                </ul>

                <h3>Transporte Público</h3>
                <ul>
                  <li>Rutas de autobús: 12, 45, 67</li>
                  <li>Metro: Estación Distrito Cultural</li>
                </ul>
              </div>
            </div>

            {/* Accesibilidad */}
            <div className="visit-card">
              <h2>Accesibilidad</h2>
              <div className="visit-details">
                <p>
                  El Museo MARCO está comprometido con ser accesible para todos
                  los visitantes.
                </p>
                <ul>
                  <li>Entradas y galerías accesibles en silla de ruedas</li>
                  <li>Elevadores disponibles a todos los pisos</li>
                  <li>Baños accesibles</li>
                  <li>Audioguías disponibles</li>
                  <li>Animales de servicio bienvenidos</li>
                  <li>Señalización en braille en todo el edificio</li>
                  <li>Interpretación en ASL disponible (con cita)</li>
                </ul>
              </div>
            </div>

            {/* Directrices para Visitantes */}
            <div className="visit-card">
              <h2>Directrices para Visitantes</h2>
              <div className="visit-details">
                <h3>Por Favor Tener en Cuenta</h3>
                <ul>
                  <li>Se permite fotografía (sin flash)</li>
                  <li>No se permiten alimentos ni bebidas en las galerías</li>
                  <li>Las bolsas grandes deben dejarse en el guardarropa</li>
                  <li>Mantener distancia de las obras de arte</li>
                  <li>Voces bajas en las galerías</li>
                  <li>Tocar solo exhibiciones interactivas designadas</li>
                </ul>

                <h3>Servicios</h3>
                <ul>
                  <li>Guardarropa disponible</li>
                  <li>Cafetería del museo</li>
                  <li>Tienda de regalos</li>
                  <li>WiFi gratuito</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Reservas */}
      <section className="booking-section">
        <div className="container">
          <div className="booking-card">
            <h2>Reserva tu Visita</h2>
            <p>Reserva tus boletos con anticipación para garantizar la entrada</p>
            <form className="booking-form" onSubmit={manejarEnvio}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fechaVisita">Fecha de Visita</label>
                  <input type="date" id="fechaVisita" name="fechaVisita" min={hoy} required />
                </div>
                <div className="form-group">
                  <label htmlFor="horaVisita">Hora Preferida</label>
                  <select id="horaVisita" name="horaVisita" required>
                    <option value="">Seleccionar hora</option>
                    <option value="09:00">9:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="13:00">1:00 PM</option>
                    <option value="15:00">3:00 PM</option>
                    <option value="17:00">5:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="adultos">Adultos</label>
                  <input
                    type="number"
                    id="adultos"
                    name="adultos"
                    min="0"
                    value={adultos}
                    onChange={(e) => setAdultos(parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="niños">Niños</label>
                  <input
                    type="number"
                    id="niños"
                    name="niños"
                    min="0"
                    value={niños}
                    onChange={(e) => setNiños(parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="estudiantes">Estudiantes</label>
                  <input
                    type="number"
                    id="estudiantes"
                    name="estudiantes"
                    min="0"
                    value={estudiantes}
                    onChange={(e) => setEstudiantes(parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="adultosMayores">Adultos Mayores</label>
                  <input
                    type="number"
                    id="adultosMayores"
                    name="adultosMayores"
                    min="0"
                    value={adultosMayores}
                    onChange={(e) => setAdultosMayores(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Correo Electrónico</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="tu.email@ejemplo.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="nombre">Nombre Completo</label>
                <input type="text" id="nombre" name="nombre" placeholder="Juan Pérez" required />
              </div>

              <div className="total-price">
                <h3>
                  Total: <span>${total.toFixed(2)}</span>
                </h3>
              </div>

              <button type="submit" className="btn btn-primary btn-large">
                Reservar Boletos
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Visita;
