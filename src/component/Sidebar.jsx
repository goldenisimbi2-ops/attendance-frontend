import {
  BarChart3,
  BookOpen,
  CalendarCheck2,
  ClipboardCheck,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  Settings,
  UserCheck,
  UserRound,
  Users,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../app/store'

const navMap = {
  admin: [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/users', label: 'Users', icon: Users },
    { to: '/admin/students', label: 'Students', icon: GraduationCap },
    { to: '/admin/teachers', label: 'Teachers', icon: UserRound },
    { to: '/admin/classes', label: 'Classes', icon: BookOpen },
    { to: '/admin/subjects', label: 'Subjects', icon: ClipboardCheck },
    { to: '/admin/class-subjects', label: 'Class Assignments', icon: CalendarCheck2 },
    { to: '/admin/attendance', label: 'Attendance', icon: BarChart3 },
  ],
  teacher: [
    { to: '/teacher/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/teacher/classes', label: 'My Classes', icon: BookOpen },
    { to: '/teacher/subjects', label: 'My Subjects', icon: ClipboardCheck },
    { to: '/teacher/sessions', label: 'Attendance Sessions', icon: CalendarCheck2 },
    { to: '/teacher/sessions/create', label: 'Create Session', icon: PlusCircle },
    { to: '/teacher/attendance', label: 'Mark Attendance', icon: UserCheck },
    { to: '/teacher/attendance/history', label: 'Attendance History', icon: BarChart3 },
    { to: '/teacher/reports', label: 'Reports', icon: BarChart3 },
  ],
  head_teacher: [
    { to: '/head-teacher/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/head-teacher/monitoring', label: 'Attendance Monitoring', icon: ClipboardCheck },
    { to: '/head-teacher/classes', label: 'Classes', icon: BookOpen },
    { to: '/head-teacher/students', label: 'Students', icon: GraduationCap },
    { to: '/head-teacher/teachers', label: 'Teachers', icon: UserRound },
    { to: '/head-teacher/reports', label: 'Attendance Reports', icon: BarChart3 },
  ],
  student: [
    { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/student/classes', label: 'My Classes', icon: BookOpen },
    { to: '/student/subjects', label: 'My Subjects', icon: ClipboardCheck },
    { to: '/student/attendance', label: 'My Attendance', icon: UserCheck },
    { to: '/student/attendance/history', label: 'Attendance History', icon: CalendarCheck2 },
    { to: '/student/attendance/summary', label: 'Attendance Summary', icon: BarChart3 },
  ],
}

function Sidebar() {
  const { user, logout } = useAuth()
  const userRole = (user?.role || '').toLowerCase().replace('-', '_')
  const items = navMap[userRole] || navMap.student

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="brand-mark">A</div>
        <div>
          <strong>Attendify</strong>
          <div className="muted small-text">{(user?.role || 'Member').toUpperCase().replace('_', ' ')}</div>
        </div>
      </div>

      <nav>
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to={to}>
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}

        <NavLink className="nav-link" to="/profile">
          <Settings size={18} />
          <span>Profile</span>
        </NavLink>

        <button type="button" className="nav-link nav-link--logout" onClick={logout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  )
}

export default Sidebar
