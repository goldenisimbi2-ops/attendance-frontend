import PropTypes from 'prop-types'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../app/store'

function RoleRoute({ allowedRoles = [] }) {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  const userRole = (user?.role || '').toLowerCase().replace('-', '_')
  const allowed = allowedRoles.map((r) => r.toLowerCase().replace('-', '_'))

  if (!allowed.includes(userRole)) {
    if (userRole === 'admin') {
      return <Navigate to="/dashboard" replace />
    }

    if (userRole === 'head_teacher') {
      return <Navigate to="/head-teacher/dashboard" replace />
    }

    if (userRole === 'teacher') {
      return <Navigate to="/teacher/dashboard" replace />
    }

    if (userRole === 'student') {
      return <Navigate to="/student/dashboard" replace />
    }

    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

RoleRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
}

export default RoleRoute
