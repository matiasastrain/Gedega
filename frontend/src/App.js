import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import AppNavbar from './components/Navbar';
import Footer from './components/Footer';

// Páginas
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PropietarioHome from './pages/roles/PropietarioHome';
import AdministradorHome from './pages/roles/AdministradorHome';
import TrabajadorHome from './pages/roles/TrabajadorHome';
import BetaHome from './pages/roles/BetaHome';
import UsersList from './pages/admin/UsersList';
import CreateUser from './pages/admin/CreateUser';

// ProtectedRoute
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { replace: true });
    }
    if (!loading && user && allowedRoles && !allowedRoles.includes(user.role)) {
      navigate('/', { replace: true });
    }
  }, [user, loading, allowedRoles, navigate]);

  if (loading) return <div className="text-center py-5">Cargando...</div>;
  if (!user) return null;
  if (allowedRoles && !allowedRoles.includes(user.role)) return null;

  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <AppNavbar /> {/* ← USA EL MISMO NOMBRE */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* DASHBOARDS POR ROL */}
        <Route path="/dashboard/propietario" element={
          <ProtectedRoute allowedRoles={['propietario']}>
            <PropietarioHome />
          </ProtectedRoute>
        } />

        <Route path="/dashboard/administrador" element={
          <ProtectedRoute allowedRoles={['administrador']}>
            <AdministradorHome />
          </ProtectedRoute>
        } />

        <Route path="/dashboard/trabajador" element={
          <ProtectedRoute allowedRoles={['trabajador']}>
            <TrabajadorHome />
          </ProtectedRoute>
        } />

        <Route path="/dashboard/beta" element={
          <ProtectedRoute allowedRoles={['beta']}>
            <BetaHome />
          </ProtectedRoute>
        } />

        {/* GESTIÓN DE USUARIOS */}
        <Route path="/users" element={
          <ProtectedRoute allowedRoles={['propietario']}>
            <UsersList />
          </ProtectedRoute>
        } />

        <Route path="/users/create" element={
          <ProtectedRoute allowedRoles={['propietario']}>
            <CreateUser />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}