// frontend/src/pages/roles/PropietarioHome.jsx
import React, { useState } from 'react';
import { Card, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ChangePasswordModal from '../../components/ChangePasswordModal';

export default function PropietarioHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="container py-5" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '80vh', borderRadius: '15px' }}>
      <div className="p-4 bg-white rounded shadow-lg">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="text-gradient" style={{ background: 'linear-gradient(to right, #667eea, #764ba2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Panel del Propietario
          </h1>
          <div className="d-flex gap-2">
            <Button 
              variant="success" 
              onClick={() => navigate('/users')}
              className="fw-bold"
            >
              + Crear Usuario
            </Button>
            <Button 
              variant="outline-danger" 
              size="sm" 
              onClick={() => setShowModal(true)}
            >
              Cambiar Contraseña
            </Button>
          </div>
        </div>

        <Alert variant="dark" className="mb-4">
          <strong>Bienvenido, {user?.username}</strong> — Tienes control total del sistema.
        </Alert>

        <div className="row g-4">
          <div className="col-md-6">
            <Card className="h-100 border-0 shadow-sm" style={{ background: '#f8f9fa' }}>
              <Card.Body className="text-center p-4">
                <h5>Gestión de Usuarios</h5>
                <p className="text-muted">Crear, editar y eliminar usuarios</p>
                <Button variant="primary" onClick={() => navigate('/users')}>
                  Ir a Usuarios
                </Button>
              </Card.Body>
            </Card>
          </div>
          <div className="col-md-6">
            <Card className="h-100 border-0 shadow-sm" style={{ background: '#f8f9fa' }}>
              <Card.Body className="text-center p-4">
                <h5>Reportes</h5>
                <p className="text-muted">Estadísticas del sistema</p>
                <Button variant="secondary" disabled>Próximamente</Button>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>

      <ChangePasswordModal 
        show={showModal} 
        onHide={() => setShowModal(false)} 
        userId={user?.id} 
      />
    </div>
  );
}