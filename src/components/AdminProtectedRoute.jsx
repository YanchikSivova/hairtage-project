import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function AdminProtectedRoute({ children }) {
  const { authenticated, isAdmin, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div>Загрузка...</div>
  }

  if (!authenticated) {
    return <Navigate to='/admin/login' state={{ from: location }} replace />
  }

  if (!isAdmin) {
    return <Navigate to='/' replace />
  }

  return children
}