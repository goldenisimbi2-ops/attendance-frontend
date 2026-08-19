import { Bell, ChevronDown, LogOut, Menu, Search, Settings, UserCircle2 } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../app/store'

function getPageTitle(pathname) {
  const map = {
    '/dashboard': 'Dashboard',
    '/admin/users': 'Users',
    '/admin/students': 'Students',
    '/admin/teachers': 'Teachers',
    '/admin/classes': 'Classes',
    '/admin/subjects': 'Subjects',
    '/admin/class-subjects': 'Class Assignments',
    '/admin/attendance': 'Attendance',
    '/teacher/dashboard': 'Teacher Dashboard',
    '/teacher/classes': 'My Classes',
    '/teacher/subjects': 'My Subjects',
    '/teacher/sessions': 'Attendance Sessions',
    '/teacher/sessions/create': 'Create Attendance Session',
    '/teacher/attendance': 'Mark Attendance',
    '/teacher/attendance/history': 'Attendance History',
    '/teacher/reports': 'Attendance Reports',
    '/student/dashboard': 'Student Dashboard',
    '/student/classes': 'My Classes',
    '/student/subjects': 'My Subjects',
    '/student/attendance': 'My Attendance',
    '/student/attendance/history': 'Attendance History',
    '/student/attendance/summary': 'Attendance Summary',
    '/head-teacher/dashboard': 'Head Teacher Dashboard',
    '/head-teacher/attendance': 'Attendance Monitoring',
    '/head-teacher/monitoring': 'Attendance Monitoring',
    '/head-teacher/classes': 'Classes Overview',
    '/head-teacher/students': 'Student Monitoring',
    '/head-teacher/teachers': 'Teacher Activity',
    '/head-teacher/reports': 'Attendance Reports',
    '/profile': 'Profile',
  }

  return map[pathname] || pathname.replace('/', '').replace(/-/g, ' ') || 'Dashboard'
}

function NavBar() {
  const { user, logout } = useAuth()
  const location = useLocation()

  const pageTitle = getPageTitle(location.pathname)

  return (
    <header className="topbar">
      <div className="topbar__left">
        <button className="mobile-nav-toggle" type="button" aria-label="Toggle navigation menu">
          <Menu size={20} />
        </button>
        <div>
          <p className="eyebrow">Attendance system</p>
          <h1>{pageTitle}</h1>
        </div>
      </div>

      <div className="topbar__right">
        <div className="search-box">
          <Search size={16} />
          <input type="text" placeholder="Search..." aria-label="Search" />
        </div>

        <button className="icon-button" type="button" aria-label="Notifications">
          <Bell size={18} />
        </button>

        <div className="user-menu">
          <div className="user-menu__avatar">
            <UserCircle2 size={22} />
          </div>
          <div className="user-menu__meta">
            <strong>{user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user?.name || 'User'}</strong>
            <span>{(user?.role || 'Member').toUpperCase()}</span>
          </div>
          <ChevronDown size={16} />
          <div className="user-menu__dropdown">
            <Link to="/profile">
              <UserCircle2 size={16} /> Profile
            </Link>
            <Link to="/profile">
              <Settings size={16} /> Settings
            </Link>
            <button type="button" onClick={logout}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default NavBar
