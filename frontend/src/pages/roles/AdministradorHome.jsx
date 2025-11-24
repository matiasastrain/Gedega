import React, { useState } from 'react';
import { Card, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import ChangePasswordModal from '../../components/ChangePasswordModal';


export default function AdministradorHome() {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="container py-5" style={{ background: '#fff3cd', minHeight: '80vh', borderRadius: '15px' }}>
      <div className="p-4 bg-white rounded shadow">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="text-warning">Panel del Administrador</h1>
          <Button variant="outline-warning" size="sm" onClick={() => setShowModal(true)}>
            Cambiar Contraseña
          </Button>
        </div>

        <Alert variant="warning">
          <strong>{user?.username}</strong> — Gestiona usuarios y tareas.
        </Alert>

        <div className="row g-4">
          <div className="col-md-12">
            <Card className="border-warning">
              <Card.Body>
                <h5>Usuarios Registrados</h5>
                <p>Puedes ver la lista completa de usuarios.</p>
                <Button variant="outline-warning">Ver Usuarios</Button>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>

      <ChangePasswordModal show={showModal} onHide={() => setShowModal(false)} userId={user?.id} />
    </div>
  );
}