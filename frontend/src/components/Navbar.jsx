// frontend/src/components/Navbar.jsx
import React from 'react';
import { Navbar as BSNavbar, Nav, Button, Container, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AppNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // COLORES PASTEL PERSONALIZADOS
  const pastelColors = {
    propietario: { bg: '#5e81ac', text: 'white' },      // Azul nórdico suave
    administrador: { bg: '#d8a48f', text: 'dark' },     // Melocotón pastel
    trabajador: { bg: '#88c0d0', text: 'dark' },        // Cian nórdico
    beta: { bg: '#b48ead', text: 'white' }              // Lavanda suave
  };

  const colors = user ? pastelColors[user.role] : { bg: '#f8f9fa', text: 'dark' };

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
          className={`fw-bold ${user ? 'text-white' : 'text-primary'}`}
          style={{ fontSize: '1.5rem' }}
        >
          Landy App
        </BSNavbar.Brand>

        <BSNavbar.Toggle aria-controls="main-navbar" />
        <BSNavbar.Collapse id="main-navbar">
          <Nav className="ms-auto align-items-center gap-2">

            {/* SIN LOGIN */}
            {!user && (
              <>
                <Nav.Link as={Link} to="/login" className="text-primary fw-medium">
                  Iniciar Sesión
                </Nav.Link>
                <Button variant="outline-primary" size="sm">
                  <Nav.Link as={Link} to="/register" className="text-primary">
                    Registrarse
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
                  Inicio
                </Nav.Link>

                {/* DASHBOARD */}
                <Nav.Link 
                  as={Link} 
                  to={`/dashboard/${user.role}`} 
                  className={`text-${colors.text} fw-bold`}
                >
                  Mi Panel
                </Nav.Link>

                {/* MENÚS POR ROL */}
                {user.role === 'propietario' && (
                  <NavDropdown 
                    title="Gestión" 
                    id="propietario-gestion" 
                    className="text-white"
                  >
                    <NavDropdown.Item as={Link} to="/users">Usuarios</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/users/create">Crear Usuario</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item>Reportes</NavDropdown.Item>
                  </NavDropdown>
                )}

                {user.role === 'administrador' && (
                  <NavDropdown title="Admin" id="admin-menu" className="text-dark">
                    <NavDropdown.Item as={Link} to="/users">Ver Usuarios</NavDropdown.Item>
                    <NavDropdown.Item>Gestionar Tareas</NavDropdown.Item>
                  </NavDropdown>
                )}

                {user.role === 'trabajador' && (
                  <NavDropdown title="Tareas" id="trabajador-menu" className="text-dark">
                    <NavDropdown.Item as={Link} to="/tasks/my">Mis Tareas</NavDropdown.Item>
                    <NavDropdown.Item>Mis Reportes</NavDropdown.Item>
                  </NavDropdown>
                )}

                {user.role === 'beta' && (
                  <NavDropdown title="Beta" id="beta-menu" className="text-white">
                    <NavDropdown.Item>Nuevas Funciones</NavDropdown.Item>
                    <NavDropdown.Item>Enviar Feedback</NavDropdown.Item>
                  </NavDropdown>
                )}

                {/* CERRAR SESIÓN */}
                <Button 
                  variant="outline-light" 
                  size="sm" 
                  onClick={handleLogout}
                  className="border-white text-white"
                >
                  Cerrar Sesión
                </Button>
              </>
            )}

          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
}