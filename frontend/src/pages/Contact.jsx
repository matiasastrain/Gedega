// src/pages/Contact.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import API from '../services/api';        // igual que en TrabajadorHome
import './Contact.css';

export default function Contact() {
  const { t } = useTranslation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name || !email) {
      setErrorMsg(t('Please fill in all required fields'));
      return;
    }

    try {
      setLoading(true);

      // 🔗 llamada al backend (ajusta la ruta si tu API usa otra)
      await API.post('/contact', {
        name,
        email,
        message,
      });

      setSuccessMsg(t('Your message was sent successfully'));
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      console.error(err);
      setErrorMsg(t('There was an error sending your message'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact-section py-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <Card className="contact-card shadow-sm">
              <Card.Body>
                <h2 className="contact-title mb-3">
                  {t('Contact Us')}
                </h2>
                <p className="text-muted mb-4">
                  {t('Send us an email to:')}{' '}
                  <strong>{t('contact email')}</strong>
                </p>

                {errorMsg && (
                  <Alert variant="danger" className="mb-3">
                    {errorMsg}
                  </Alert>
                )}

                {successMsg && (
                  <Alert variant="success" className="mb-3">
                    {successMsg}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="contactName">
                    <Form.Label>{t('Name')}</Form.Label>
                    <Form.Control
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t('Name')}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="contactEmail">
                    <Form.Label>{t('Email')}</Form.Label>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nombre@empresa.cl"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="contactMessage">
                    <Form.Label>{t('Message')}</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={t('Write your message here')}
                    />
                  </Form.Group>

                  <div className="d-flex justify-content-start">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="px-5 rounded-pill contact-btn-primary"
                    >
                      {loading ? t('Sending...') : t('Send')}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
