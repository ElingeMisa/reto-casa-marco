import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';
import { Usuario } from '../types';

interface AuthContextType {
  usuario: Usuario | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  registro: (nombre: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  actualizarSaldo: (nuevoSaldo: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const cargarUsuario = async () => {
      const tokenGuardado = localStorage.getItem('authToken');
      const usuarioGuardado = localStorage.getItem('usuario');

      if (tokenGuardado && usuarioGuardado) {
        try {
          setToken(tokenGuardado);
          setUsuario(JSON.parse(usuarioGuardado));

          // Verificar que el token sigue siendo válido
          const perfil = await api.get<{ usuario: Usuario }>('/auth/perfil');
          setUsuario(perfil.usuario);
        } catch (error) {
          // Token inválido, limpiar
          localStorage.removeItem('authToken');
          localStorage.removeItem('usuario');
          setToken(null);
          setUsuario(null);
        }
      }
      setLoading(false);
    };

    cargarUsuario();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post<{
        token: string;
        usuario: Usuario;
        mensaje: string;
      }>('/auth/login', { email, password });

      setToken(response.token);
      setUsuario(response.usuario);

      localStorage.setItem('authToken', response.token);
      localStorage.setItem('usuario', JSON.stringify(response.usuario));
    } catch (error: any) {
      const mensaje = error.response?.data?.error || 'Error al iniciar sesión';
      throw new Error(mensaje);
    }
  };

  const registro = async (nombre: string, email: string, password: string) => {
    try {
      const response = await api.post<{
        token: string;
        usuario: Usuario;
        mensaje: string;
      }>('/auth/registro', { nombre, email, password });

      setToken(response.token);
      setUsuario(response.usuario);

      localStorage.setItem('authToken', response.token);
      localStorage.setItem('usuario', JSON.stringify(response.usuario));
    } catch (error: any) {
      const mensaje = error.response?.data?.error || 'Error al registrarse';
      throw new Error(mensaje);
    }
  };

  const logout = () => {
    setToken(null);
    setUsuario(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('usuario');
  };

  const actualizarSaldo = (nuevoSaldo: number) => {
    if (usuario) {
      const usuarioActualizado = { ...usuario, saldo: nuevoSaldo };
      setUsuario(usuarioActualizado);
      localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
    }
  };

  const value: AuthContextType = {
    usuario,
    token,
    loading,
    login,
    registro,
    logout,
    actualizarSaldo,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
