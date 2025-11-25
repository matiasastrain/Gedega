// frontend/src/pages/admin/CreateUser.jsx
import React, { useState } from 'react';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password.length < 8) {
      setError(t('Password must be at least 8 characters'));
      return;
    }

    try {
      await API.post('/users', formData);
      setSuccess(t('user.createdSuccess'));
      setTimeout(() => {
        navigate('/users');
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.error || t('Error creating user')
      );
    }
  };

  return (
    <div className="container py-5">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">
          <h3 className="mb-0">{t('Create New User')}</h3>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>{t('Username')}</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>{t('Email')}</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>{t('Password')}</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>{t('Role')}</Form.Label>
              <Form.Select
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="beta">{t('Beta')}</option>
                <option value="trabajador">{t('Worker')}</option>
                <option value="propietario">{t('Owner')}</option>
              </Form.Select>
            </Form.Group>

            <div className="d-flex gap-2">
              <Button type="submit" className="auth-btn-primary">
                {t('Create User')}
              </Button>
              <Button variant="secondary" onClick={() => navigate('/users')}>
                {t('Cancel')}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
