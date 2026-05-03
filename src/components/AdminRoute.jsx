import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function AdminRoute({ children }) {
  const { isAdmin, loading } = useAuth()

  if (loading) {
    return <div className="container-shell py-20 text-center text-muted">Checking admin access...</div>
  }

  return isAdmin ? children : <Navigate to="/" replace />
}

export default AdminRoute
