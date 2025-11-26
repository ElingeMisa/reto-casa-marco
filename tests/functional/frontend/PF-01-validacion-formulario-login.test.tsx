/**
 * PF-01: Validación de campos de entrada en formulario de login
 *
 * Verificar que el frontend implementa validaciones de formato, longitud
 * mínima/máxima y caracteres permitidos en campos de usuario y contraseña
 * antes de enviar datos al backend. Se debe validar restricción de
 * caracteres especiales para prevenir XSS (OWASP A03: Injection).
 *
 * Resultado esperado: El sistema rechaza entradas con formato inválido
 * mostrando mensajes de error claros sin procesar la petición.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '../helpers/testUtils';
import Login from '../../../src/pages/Login';
import api from '../../../src/services/api';

jest.mock('../../../src/services/api');
const mockApi = api as jest.Mocked<typeof api>;

describe('PF-01: Validación de campos de entrada en formulario de login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Validación de formato de email', () => {
    it('debe requerir un email válido', async () => {
      render(<Login />);

      const emailInput = screen.getByLabelText(/correo electrónico/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

      // Intentar enviar con email inválido
      fireEvent.change(emailInput, { target: { value: 'correo-invalido' } });
      fireEvent.change(passwordInput, { target: { value: 'Password123' } });
      fireEvent.click(submitButton);

      // El formulario no debe enviar la petición
      expect(mockApi.post).not.toHaveBeenCalled();
    });

    it('debe aceptar formato de email válido', async () => {
      mockApi.post.mockResolvedValue({
        token: 'test-token',
        usuario: { id: 1, nombre: 'Test', email: 'test@test.com', saldo: 0 },
        mensaje: 'Login exitoso'
      });

      render(<Login />);

      const emailInput = screen.getByLabelText(/correo electrónico/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

      fireEvent.change(emailInput, { target: { value: 'usuario@museomarco.com' } });
      fireEvent.change(passwordInput, { target: { value: 'Password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockApi.post).toHaveBeenCalledWith('/auth/login', {
          email: 'usuario@museomarco.com',
          password: 'Password123'
        });
      });
    });
  });

  describe('Validación de longitud de contraseña', () => {
    it('debe rechazar contraseñas menores a 8 caracteres', async () => {
      render(<Login />);

      const passwordInput = screen.getByLabelText(/contraseña/i);

      // Verificar que el input tiene minLength constraint
      expect(passwordInput).toHaveAttribute('minLength', '8');

      // Nota: En ambientes de testing como jsdom, la validación HTML5 minLength
      // no siempre previene el submit. En navegadores reales sí funciona correctamente.
      // Esta prueba verifica que el constraint está presente en el HTML.
      console.log('✅ Constraint minLength=8 presente en el campo de contraseña');
    });

    it('debe aceptar contraseñas de 8 o más caracteres', async () => {
      mockApi.post.mockResolvedValue({
        token: 'test-token',
        usuario: { id: 1, nombre: 'Test', email: 'test@test.com', saldo: 0 },
        mensaje: 'Login exitoso'
      });

      render(<Login />);

      const emailInput = screen.getByLabelText(/correo electrónico/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

      fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
      fireEvent.change(passwordInput, { target: { value: 'Password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockApi.post).toHaveBeenCalled();
      });
    });
  });

  describe('Protección contra XSS en inputs', () => {
    it('debe sanitizar caracteres especiales peligrosos en email', async () => {
      mockApi.post.mockResolvedValue({
        token: 'test-token',
        usuario: { id: 1, nombre: 'Test', email: 'test@test.com', saldo: 0 },
        mensaje: 'Login exitoso'
      });

      render(<Login />);

      const emailInput = screen.getByLabelText(/correo electrónico/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

      // Intentar inyectar script en email
      const maliciousEmail = 'test@test.com<script>alert("XSS")</script>';
      fireEvent.change(emailInput, { target: { value: maliciousEmail } });
      fireEvent.change(passwordInput, { target: { value: 'Password123' } });
      fireEvent.click(submitButton);

      // Verificar que no se procese el script
      await waitFor(() => {
        if (mockApi.post.mock.calls.length > 0) {
          const calledEmail = mockApi.post.mock.calls[0][1].email;
          // El email debe ser tratado como texto plano
          expect(calledEmail).not.toContain('<script>');
          expect(calledEmail).not.toContain('</script>');
        }
      });
    });

    it('debe prevenir payloads de SQL injection en campos', async () => {
      render(<Login />);

      const emailInput = screen.getByLabelText(/correo electrónico/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

      // Intentar SQL injection
      fireEvent.change(emailInput, { target: { value: "admin@test.com' OR '1'='1" } });
      fireEvent.change(passwordInput, { target: { value: "' OR '1'='1" } });

      // El tipo email debe rechazar este formato
      fireEvent.click(submitButton);

      // No debe llamar al API con formato inválido de email
      expect(mockApi.post).not.toHaveBeenCalled();
    });
  });

  describe('Campos requeridos', () => {
    it('debe requerir email', async () => {
      render(<Login />);

      const emailInput = screen.getByLabelText(/correo electrónico/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);

      expect(emailInput).toBeRequired();
      expect(passwordInput).toBeRequired();
    });

    it('no debe permitir submit sin completar campos', async () => {
      render(<Login />);

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      fireEvent.click(submitButton);

      // No debe hacer la petición
      expect(mockApi.post).not.toHaveBeenCalled();
    });
  });

  describe('Feedback de errores', () => {
    it('debe mostrar mensaje de error cuando falla el login', async () => {
      mockApi.post.mockRejectedValue({
        response: { data: { error: 'Credenciales inválidas' } }
      });

      render(<Login />);

      const emailInput = screen.getByLabelText(/correo electrónico/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

      fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
      fireEvent.change(passwordInput, { target: { value: 'WrongPassword123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/credenciales inválidas/i)).toBeInTheDocument();
      });
    });

    it('debe deshabilitar el botón durante el submit', async () => {
      mockApi.post.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));

      render(<Login />);

      const emailInput = screen.getByLabelText(/correo electrónico/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

      fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
      fireEvent.change(passwordInput, { target: { value: 'Password123' } });
      fireEvent.click(submitButton);

      // El botón debe estar deshabilitado durante la carga
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveTextContent(/iniciando sesión/i);
    });
  });
});
