import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Alert, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDelete, setShowDelete] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const navigate = useNavigate(); // ← AQUÍ ESTÁ BIEN

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await API.get('/users');
      setUsers(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const changeRole = async (userId, newRole) => {
    try {
      await API.put(`/users/${userId}/role`, { role: newRole });
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      setError('Error al cambiar rol');
    }
  };

  const confirmDelete = (user) => {
    setUserToDelete(user);
    setShowDelete(true);
  };

  const deleteUser = async () => {
    if (!userToDelete) return;
    try {
      await API.delete(`/users/${userToDelete.id}`);
      setUsers(users.filter(u => u.id !== userToDelete.id));
      setShowDelete(false);
      setUserToDelete(null);
    } catch (err) {
      setError('Error al eliminar usuario');
    }
  };

  // ← FUNCIÓN PARA IR A CREAR USUARIO
  const goToCreateUser = () => {
    navigate('/users/create');
  };

  if (loading) return <div className="text-center py-5">Cargando...</div>;

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-primary">Gestión de Usuarios</h1>
        <Button 
          variant="success" 
          onClick={goToCreateUser} // ← USA LA FUNCIÓN
          className="fw-bold"
        >
          + Crear Usuario
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table responsive hover>
        <thead className="table-primary">
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>
                <Badge bg={
                  u.role === 'propietario' ? 'danger' :
                  u.role === 'administrador' ? 'warning' :
                  u.role === 'trabajador' ? 'info' : 'secondary'
                }>
                  {u.role}
                </Badge>
              </td>
              <td>
                <div className="btn-group me-2">
                  {['beta', 'trabajador', 'administrador', 'propietario'].map(role => (
                    <Button
                      key={role}
                      size="sm"
                      variant={u.role === role ? 'primary' : 'outline-secondary'}
                      onClick={() => changeRole(u.id, role)}
                      disabled={u.role === role}
                    >
                      {role}
                    </Button>
                  ))}
                </div>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => confirmDelete(u)}
                  disabled={u.role === 'propietario'}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showDelete} onHide={() => setShowDelete(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Eliminar al usuario <strong>{userToDelete?.username}</strong>?
          <br />Esta acción es permanente.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDelete(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={deleteUser}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}