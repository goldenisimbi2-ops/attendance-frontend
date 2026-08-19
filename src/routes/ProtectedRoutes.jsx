import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../app/store'

function ProtectedRoutes() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <div className="full-page-loader"><div className="spinner large" /></div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoutes
