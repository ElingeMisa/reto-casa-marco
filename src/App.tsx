import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Inicio from './pages/Inicio';
import Exposiciones from './pages/Exposiciones';
import Colecciones from './pages/Colecciones';
import Visita from './pages/Visita';
import Acerca from './pages/Acerca';
import './styles/App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/exposiciones" element={<Exposiciones />} />
            <Route path="/colecciones" element={<Colecciones />} />
            <Route path="/visita" element={<Visita />} />
            <Route path="/acerca" element={<Acerca />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
