// frontend/src/components/ChangePasswordModal.jsx
import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import API from '../services/api';
import { useTranslation } from 'react-i18next';

export default function ChangePasswordModal({ show, onHide, userId }) {
  const { t } = useTranslation();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError(t('Passwords do not match'));
      return;
    }
    if (newPassword.length < 8) {
      setError(t('Password must be at least 8 characters'));
      return;
    }

    try {
      await API.put(`/users/${userId}/password`, {
        currentPassword,
        newPassword
      });
      setSuccess(t('Password updated successfully'));
      setTimeout(() => {
        onHide();
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || t('Error changing password'));
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('Change Password')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>{t('Current Password')}</Form.Label>
            <Form.Control
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>{t('New Password')}</Form.Label>
            <Form.Control
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>{t('Confirm New Password')}</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Form.Group>
          <div className="d-flex gap-2">
            <Button variant="secondary" onClick={onHide}>
              {t('Cancel')}
            </Button>
            <Button variant="primary" type="submit">
              {t('Change')}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
