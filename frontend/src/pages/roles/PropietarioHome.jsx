// frontend/src/pages/roles/PropietarioHome.jsx
import React, { useState } from 'react';
import { Card, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ChangePasswordModal from '../../components/ChangePasswordModal';
import { useTranslation } from 'react-i18next';

export default function PropietarioHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="container py-5">
      {/* Fondo degradado como “banner” */}
      <div
        className="p-4 rounded-4 shadow-lg"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <div className="p-4 bg-white rounded-3">
          {/* Título + botones */}
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <h1
              className="text-gradient mb-0"
              style={{
                background: 'linear-gradient(to right, #667eea, #764ba2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {t('Owner Panel')}
            </h1>
            <div className="d-flex gap-2">
              <Button
                variant="success"
                onClick={() => navigate('/users')}
                className="fw-bold"
              >
                {t('Create User')}
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => setShowModal(true)}
              >
                {t('Change Password')}
              </Button>
            </div>
          </div>

          {/* Mensaje de bienvenida */}
          <Alert variant="dark" className="mb-4">
            <strong>
              {t('Welcome')}, {user?.username}
            </strong>{' '}
            — {t('You have full system control')}
          </Alert>

          {/* Tarjetas */}
          <div className="row g-4">
            <div className="col-md-6">
              <Card
                className="h-100 border-0 shadow-sm"
                style={{ background: '#f8f9fa' }}
              >
                <Card.Body className="text-center p-4">
                  <h5>{t('User Management')}</h5>
                  <p className="text-muted">
                    {t('Create, edit and delete users')}
                  </p>
                  <Button variant="primary" onClick={() => navigate('/users')}>
                    {t('Go to Users')}
                  </Button>
                </Card.Body>
              </Card>
            </div>

            <div className="col-md-6">
              <Card
                className="h-100 border-0 shadow-sm"
                style={{ background: '#f8f9fa' }}
              >
                <Card.Body className="text-center p-4">
                  <h5>{t('Reports')}</h5>
                  <p className="text-muted">{t('System statistics')}</p>
                  <Button variant="secondary" disabled>
                    {t('Coming Soon')}
                  </Button>
                </Card.Body>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Modal cambiar contraseña */}
      <ChangePasswordModal
        show={showModal}
        onHide={() => setShowModal(false)}
        userId={user?.id}
      />
    </div>
  );
}
