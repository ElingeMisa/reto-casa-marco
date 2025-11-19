// Tipos de datos según el diseño de base de datos del PDF

export interface Usuario {
  id: number;
  nombre: string;
  email: string; // cifrado
  password: string; // hasheado con Argon2
  rol: 'usuario' | 'administrador' | 'guia';
  creadoEn: Date;
}

export interface Exposicion {
  id: number;
  titulo: string;
  descripcion: string;
  fechaInicio: Date;
  fechaFin: Date;
}

export interface Evento {
  id: number;
  exposicionId: number;
  nombre: string;
  fechaHora: Date;
  capacidad: number;
  precio: number;
}

export interface Ticket {
  id: number;
  eventoId: number;
  usuarioId: number;
  estado: 'pendiente' | 'confirmado' | 'cancelado';
}

export interface Membresia {
  id: number;
  usuarioId: number;
  tipo: 'basica' | 'premium' | 'familiar';
  fechaInicio: Date;
  fechaFin: Date;
}

export interface Donacion {
  id: number;
  usuarioId: number;
  monto: number;
  fechaCreacion: Date;
}

export interface Pago {
  id: number;
  ordenId: number;
  metodo: string; // tokenizado
  estado: 'pendiente' | 'completado' | 'fallido';
  monto: number;
}

export interface Orden {
  id: number;
  usuarioId: number;
  total: number;
  estado: 'pendiente' | 'pagado' | 'cancelado';
  fechaCreacion: Date;
}

// Tipos para formularios y UI
export interface FormularioReserva {
  eventoId: number;
  fecha: string;
  hora: string;
  numPersonas: number;
  email: string;
  nombre: string;
}

export interface ExposicionDestacada {
  exposicion: Exposicion;
  destacado: boolean;
  etiqueta: 'actual' | 'destacada' | 'nueva';
}
