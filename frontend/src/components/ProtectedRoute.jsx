import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Loading } from './Layout.jsx';

export function ProtectedRoute() {
  const { user, loading } = useAuth();
  if (loading) return <Loading label="Verificando sua sessão..." />;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
