import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div className="container-shell py-20 text-center text-muted">Loading your account...</div>
  }

  return user ? children : <Navigate to="/auth" replace state={{ from: location }} />
}

export default PrivateRoute
