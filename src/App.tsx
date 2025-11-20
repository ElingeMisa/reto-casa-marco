import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Inicio from './pages/Inicio';
import Exposiciones from './pages/Exposiciones';
import Colecciones from './pages/Colecciones';
import Visita from './pages/Visita';
import Acerca from './pages/Acerca';
import Login from './pages/Login';
import Registro from './pages/Registro';
import CanjearCodigo from './pages/CanjearCodigo';
import RecargaSaldo from './pages/RecargaSaldo';
import RecargaExitosa from './pages/RecargaExitosa';
import './styles/App.css';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Inicio />} />
              <Route path="/exposiciones" element={<Exposiciones />} />
              <Route path="/colecciones" element={<Colecciones />} />
              <Route path="/visita" element={<Visita />} />
              <Route path="/acerca" element={<Acerca />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Registro />} />
              <Route path="/canjear-codigo" element={<CanjearCodigo />} />
              <Route path="/recarga" element={<RecargaSaldo />} />
              <Route path="/recarga/exitosa" element={<RecargaExitosa />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
