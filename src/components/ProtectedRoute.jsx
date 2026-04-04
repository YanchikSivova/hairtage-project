import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function ProtectedRoute({ children }) {
  const { authenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div>Загрузка...</div>
  }

  if (!authenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />
  }

  return children
}