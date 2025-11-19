import React, { useState } from 'react';
import '../styles/Colecciones.css';

interface Coleccion {
  id: number;
  titulo: string;
  artista: string;
  año: string;
  categoria: string;
  color: string;
}

const coleccionesData: Coleccion[] = [
  { id: 1, titulo: 'La Noche Estrellada', artista: 'Vincent van Gogh', año: '1889', categoria: 'pinturas', color: '#8B7355' },
  { id: 2, titulo: 'Mona Lisa', artista: 'Leonardo da Vinci', año: '1503-1519', categoria: 'pinturas', color: '#4A5568' },
  { id: 3, titulo: 'Nenúfares', artista: 'Claude Monet', año: '1916', categoria: 'pinturas', color: '#6B8E23' },
  { id: 4, titulo: 'David', artista: 'Miguel Ángel', año: '1501-1504', categoria: 'esculturas', color: '#D3D3D3' },
  { id: 5, titulo: 'El Pensador', artista: 'Auguste Rodin', año: '1904', categoria: 'esculturas', color: '#BC8F8F' },
  { id: 6, titulo: 'Venus de Milo', artista: 'Alejandro de Antioquía', año: '150-125 AC', categoria: 'esculturas', color: '#F5DEB3' },
  { id: 7, titulo: 'Máscara del Rey Tutankamón', artista: 'Antiguo Egipto', año: '1323 AC', categoria: 'artefactos', color: '#DAA520' },
  { id: 8, titulo: 'Ánfora Romana', artista: 'Roma Antigua', año: '100-200 DC', categoria: 'artefactos', color: '#8B4513' },
  { id: 9, titulo: 'Cerámica Griega', artista: 'Grecia Antigua', año: '500 AC', categoria: 'artefactos', color: '#2F4F4F' },
  { id: 10, titulo: 'Evangelio Iluminado', artista: 'Monjes Medievales', año: '1200-1250', categoria: 'manuscritos', color: '#8B7D6B' },
  { id: 11, titulo: 'Codex Atlántico', artista: 'Leonardo da Vinci', año: '1478-1519', categoria: 'manuscritos', color: '#A0826D' },
  { id: 12, titulo: 'Rollos del Mar Muerto', artista: 'Escribas Antiguos', año: '300-100 AC', categoria: 'manuscritos', color: '#654321' },
];

const Colecciones: React.FC = () => {
  const [filtroActivo, setFiltroActivo] = useState('todos');
  const [busqueda, setBusqueda] = useState('');

  const coleccionesFiltradas = coleccionesData.filter((item) => {
    const coincideFiltro = filtroActivo === 'todos' || item.categoria === filtroActivo;
    const coincideBusqueda =
      item.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.artista.toLowerCase().includes(busqueda.toLowerCase());
    return coincideFiltro && coincideBusqueda;
  });

  return (
    <div className="colecciones">
      {/* Encabezado de Página */}
      <section className="page-header">
        <div className="container">
          <h1>Nuestras Colecciones</h1>
          <p>Explora nuestra extensa colección de artefactos y obras de arte</p>
        </div>
      </section>

      {/* Filtros de Colección */}
      <section className="collection-filters">
        <div className="container">
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filtroActivo === 'todos' ? 'active' : ''}`}
              onClick={() => setFiltroActivo('todos')}
            >
              Todos los Artículos
            </button>
            <button
              className={`filter-btn ${filtroActivo === 'pinturas' ? 'active' : ''}`}
              onClick={() => setFiltroActivo('pinturas')}
            >
              Pinturas
            </button>
            <button
              className={`filter-btn ${filtroActivo === 'esculturas' ? 'active' : ''}`}
              onClick={() => setFiltroActivo('esculturas')}
            >
              Esculturas
            </button>
            <button
              className={`filter-btn ${filtroActivo === 'artefactos' ? 'active' : ''}`}
              onClick={() => setFiltroActivo('artefactos')}
            >
              Artefactos
            </button>
            <button
              className={`filter-btn ${filtroActivo === 'manuscritos' ? 'active' : ''}`}
              onClick={() => setFiltroActivo('manuscritos')}
            >
              Manuscritos
            </button>
          </div>
          <div className="search-box">
            <input
              type="text"
              placeholder="Buscar colecciones..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Cuadrícula de Colecciones */}
      <section className="collections-grid-section">
        <div className="container">
          <div className="collections-grid">
            {coleccionesFiltradas.map((item) => (
              <div key={item.id} className="collection-item">
                <div
                  className="collection-item-image"
                  style={{ backgroundColor: item.color }}
                >
                  <span className="collection-tag">
                    {item.categoria.charAt(0).toUpperCase() + item.categoria.slice(1)}
                  </span>
                </div>
                <div className="collection-item-info">
                  <h3>{item.titulo}</h3>
                  <p className="artist">{item.artista}</p>
                  <p className="year">{item.año}</p>
                </div>
              </div>
            ))}
          </div>
          {coleccionesFiltradas.length === 0 && (
            <div className="no-results">
              <p>No se encontraron resultados para tu búsqueda.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Colecciones;
