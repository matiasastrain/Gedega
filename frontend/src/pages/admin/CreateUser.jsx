import React, { useState } from 'react';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';

export default function CreateUser() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'beta'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    try {
      await API.post('/users', formData);
      setSuccess('Usuario creado exitosamente');
      setTimeout(() => {
        navigate('/users');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear usuario');
    }
  };

  return (
    <div className="container py-5">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">
          <h3 className="mb-0">Crear Nuevo Usuario</h3>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre de usuario</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Rol</Form.Label>
              <Form.Select name="role" value={formData.role} onChange={handleChange}>
                <option value="beta">Beta</option>
                <option value="trabajador">Trabajador</option>
                <option value="administrador">Administrador</option>
                <option value="propietario">Propietario</option>
              </Form.Select>
            </Form.Group>

            <div className="d-flex gap-2">
              <Button type="submit" className="auth-btn-primary">
                Crear Usuario
              </Button>
              <Button variant="secondary" onClick={() => navigate('/users')}>
                Cancelar
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}