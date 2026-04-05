import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function AdminProtectedRoute({ children }) {
  const { isAuth, isAdmin, loading, initialized } = useAuth();
  const location = useLocation();

  if (loading || !initialized) {
    return <div>Загрузка...</div>;
  }

  if (!isAuth) {
    return <Navigate to='/admin/login' state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return <Navigate to='/' replace />;
  }

  return children;
}