// frontend/src/components/Navbar.jsx
import React from 'react';
import {
  Navbar as BSNavbar,
  Nav,
  Button,
  Container,
  NavDropdown
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

export default function AppNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // COLORES PASTEL PERSONALIZADOS
  const pastelColors = {
    propietario: { bg: '#5e81ac', text: 'white' }, // Azul nórdico suave
    trabajador: { bg: '#88c0d0', text: 'dark' },   // Cian nórdico
    beta: { bg: '#b48ead', text: 'white' }         // Lavanda suave
  };

  const colors = user
    ? pastelColors[user.role]
    : { bg: '#f8f9fa', text: 'dark' };

  return (
    <BSNavbar
      style={{ backgroundColor: colors.bg, borderBottom: '3px solid #dee2e6' }}
      expand="lg"
      sticky="top"
      className="shadow-sm"
    >
      <Container>
        {/* LOGO */}
        <BSNavbar.Brand
          as={Link}
          to="/"
          className="fw-bold brand-geody"
          style={{ fontSize: '1.5rem' }}
        >
          GeoDy
        </BSNavbar.Brand>

        <BSNavbar.Toggle aria-controls="main-navbar" />
        <BSNavbar.Collapse id="main-navbar">
          <Nav className="ms-auto align-items-center gap-2">
            {/* SWITCH IDIOMA SIEMPRE VISIBLE */}
            <LanguageSwitcher />

            {/* SIN LOGIN */}
            {!user && (
              <>
                <Nav.Link
                  as={Link}
                  to="/login"
                  className="text-primary fw-medium"
                >
                  {t('Log In')}
                </Nav.Link>
                <Button variant="outline-primary" size="sm">
                  <Nav.Link as={Link} to="/register" className="text-primary">
                    {t('Register')}
                  </Nav.Link>
                </Button>
              </>
            )}

            {/* CON LOGIN */}
            {user && (
              <>
                {/* INICIO */}
                <Nav.Link
                  as={Link}
                  to="/"
                  className={`text-${colors.text} fw-medium`}
                >
                  {t('Home')}
                </Nav.Link>

                {/* DASHBOARD */}
                <Nav.Link
                  as={Link}
                  to={`/dashboard/${user.role}`}
                  className={`text-${colors.text} fw-bold`}
                >
                  {t('My Panel')}
                </Nav.Link>

                {/* MENÚS POR ROL */}
                {user.role === 'propietario' && (
                  <NavDropdown
                    title={t('Management')}
                    id="propietario-gestion"
                    className="text-white"
                  >
                    <NavDropdown.Item as={Link} to="/users">
                      {t('Users')}
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/users/create">
                      {t('Create User')}
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item>{t('Reports')}</NavDropdown.Item>
                  </NavDropdown>
                )}

                {user.role === 'trabajador' && (
                  <NavDropdown
                    title={t('Tasks')}
                    id="trabajador-menu"
                    className="text-dark"
                  >
                    <NavDropdown.Item as={Link} to="/tasks/my">
                      {t('My Tasks')}
                    </NavDropdown.Item>
                    <NavDropdown.Item>
                      {t('My Reports')}
                    </NavDropdown.Item>
                  </NavDropdown>
                )}

                {user.role === 'beta' && (
                  <NavDropdown
                    title={t('Beta')}
                    id="beta-menu"
                    className="text-white"
                  >
                    <NavDropdown.Item>
                      {t('New Features')}
                    </NavDropdown.Item>
                    <NavDropdown.Item>
                      {t('Send Feedback')}
                    </NavDropdown.Item>
                  </NavDropdown>
                )}

                {/* CERRAR SESIÓN */}
                <Button
                  variant="outline-light"
                  size="sm"
                  onClick={handleLogout}
                  className="border-white text-white"
                >
                  {t('Log Out')}
                </Button>
              </>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
}
