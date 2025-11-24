import React, { useState } from 'react';
import { Alert, Button } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import ChangePasswordModal from '../../components/ChangePasswordModal';

export default function BetaHome() {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="container py-5" style={{ background: '#f8d7da', minHeight: '80vh', borderRadius: '15px' }}>
      <div className="p-4 bg-white rounded shadow">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="text-secondary">Panel Beta</h1>
          <Button variant="outline-secondary" size="sm" onClick={() => setShowModal(true)}>
            Cambiar Contraseña
          </Button>
        </div>

        <Alert variant="secondary">
          <strong>¡Gracias por ser Beta, {user?.username}!</strong>
        </Alert>

        <div className="text-center py-5">
          <h3>Nuevas funciones en prueba</h3>
          <Button variant="outline-secondary" disabled>
            Disponible pronto
          </Button>
        </div>
      </div>

      <ChangePasswordModal show={showModal} onHide={() => setShowModal(false)} userId={user?.id} />
    </div>
  );
}