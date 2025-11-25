import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Alert, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { useTranslation } from 'react-i18next';

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDelete, setShowDelete] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

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
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
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
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      setShowDelete(false);
      setUserToDelete(null);
    } catch (err) {
      setError('Error al eliminar usuario');
    }
  };

  const goToCreateUser = () => {
    navigate('/users/create');
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'propietario':
        return t('Owner');
      case 'trabajador':
        return t('Worker');
      case 'beta':
      default:
        return t('Beta');
    }
  };

  const roleOptions = [
    { value: 'beta', label: t('Beta') },
    { value: 'trabajador', label: t('Worker') },
    { value: 'propietario', label: t('Owner') },
  ];

  if (loading) {
    return (
      <div className="text-center py-5">
        {t('Loading')}
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-primary">{t('User Management')}</h1>
        <Button
          variant="success"
          onClick={goToCreateUser}
          className="fw-bold"
        >
          + {t('Create User')}
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table responsive hover>
        <thead className="table-primary">
          <tr>
            <th>{t('ID')}</th>
            <th>{t('Username')}</th>
            <th>{t('Email')}</th>
            <th>{t('Role')}</th>
            <th>{t('Action')}</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>
                <Badge
                  bg={
                    u.role === 'propietario'
                      ? 'danger'
                      : u.role === 'trabajador'
                      ? 'info'
                      : 'secondary'
                  }
                >
                  {getRoleLabel(u.role)}
                </Badge>
              </td>
              <td>
                <div className="btn-group me-2">
                  {roleOptions.map((role) => (
                    <Button
                      key={role.value}
                      size="sm"
                      variant={
                        u.role === role.value ? 'primary' : 'outline-secondary'
                      }
                      onClick={() => changeRole(u.id, role.value)}
                      disabled={u.role === role.value}
                    >
                      {role.label}
                    </Button>
                  ))}
                </div>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => confirmDelete(u)}
                  disabled={u.role === 'propietario'}
                >
                  {t('Delete')}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showDelete} onHide={() => setShowDelete(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t('Confirm Delete')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {t('delete.userQuestion', {
            username: userToDelete?.username || '',
          })}
          <br />
          {t('delete.permanent')}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDelete(false)}>
            {t('Cancel')}
          </Button>
          <Button variant="danger" onClick={deleteUser}>
            {t('Delete')}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
