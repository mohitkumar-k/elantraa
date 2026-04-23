import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function AdminRoute({ children }) {
  const { isAdmin, loading } = useAuth()

  if (loading) {
    return <div className="container-shell py-20 text-center text-[#6f5160]">Checking admin access...</div>
  }

  return isAdmin ? children : <Navigate to="/" replace />
}

export default AdminRoute
