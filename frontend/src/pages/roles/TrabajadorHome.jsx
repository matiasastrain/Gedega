import React, { useState } from 'react';
import { Card, Alert, Button } from 'react-bootstrap';
import ChangePasswordModal from '../../components/ChangePasswordModal';
import { useAuth } from '../../context/AuthContext';


export default function TrabajadorHome() {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="container py-5" style={{ background: '#d1ecf1', minHeight: '80vh', borderRadius: '15px' }}>
      <div className="p-4 bg-white rounded shadow">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="text-info">Panel del Trabajador</h1>
          <Button variant="outline-info" size="sm" onClick={() => setShowModal(true)}>
            Cambiar Contraseña
          </Button>
        </div>

        <Alert variant="info">
          <strong>¡Hola, {user?.username}!</strong> Aquí están tus tareas.
        </Alert>

        <Card className="text-center p-5">
          <Card.Body>
            <h4>Sin tareas asignadas</h4>
            <p className="text-muted">El administrador te asignará tareas pronto.</p>
          </Card.Body>
        </Card>
      </div>

      <ChangePasswordModal show={showModal} onHide={() => setShowModal(false)} userId={user?.id} />
    </div>
  );
}