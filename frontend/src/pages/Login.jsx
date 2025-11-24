import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await API.post('/auth/login', { email, password });
      login(data.user, data.token);

      // REDIRECCIÓN POR ROL
      const rolePath = {
        propietario: '/dashboard/propietario',
        administrador: '/dashboard/administrador',
        trabajador: '/dashboard/trabajador',
        beta: '/dashboard/beta'
      };
      navigate(rolePath[data.user.role] || '/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="text-center mb-4 text-primary">Iniciar Sesión</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Button type="submit" className="w-100 auth-btn-primary">
            Entrar
          </Button>
        </Form>
        <p className="text-center mt-3">
          ¿No tienes cuenta? <Link to="/register" className="text-primary">Regístrate</Link>
        </p>
      </div>
    </div>
  );
}