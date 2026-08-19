import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../app/store'
import Spinner from '../component/ui/Spinner'

function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="full-page-loader">
        <Spinner size="large" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
