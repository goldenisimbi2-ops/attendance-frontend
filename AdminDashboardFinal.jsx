import { useEffect, useState } from 'react'
import { Users, GraduationCap, UserRound, BookOpen, BarChart3, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import api from '../../app/api'
import { useAuth } from '../../app/store'
import PageHeader from '../../component/PageHeader'
import StatCard from '../../component/StatCard'
import LoadingSkeleton from '../../component/LoadingSkeleton'
import ErrorState from '../../component/ErrorState'
import Button from '../../component/ui/Button'

function AdminDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      setError(null)
      const { data } = await api.get('/dashboard')
      setStats(data)
    } catch (err) {
      setError(err.message || 'Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="dashboard-shell">
        <LoadingSkeleton rows={2} columns={4} type="cards" />
        <LoadingSkeleton rows={5} columns={3} />
      </div>
    )
  }

  if (error) {
    return <ErrorState message={error} retryAction={fetchDashboard} />
  }

  const userName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user?.name || 'Admin'

  return (
    <div className="dashboard-shell">
      <PageHeader
        title={`Good morning, ${userName}`}
        subtitle="Here's an overview of your attendance system."
        hero
      />

      <div className="stats-grid stats-grid--four">
        <StatCard icon={GraduationCap} label="Total Students" value={stats?.totalStudents || 0} trendLabel="Active students" />
        <StatCard icon={UserRound} label="Total Teachers" value={stats?.totalTeachers || 0} trendLabel="Teaching staff" />
        <StatCard icon={BookOpen} label="Total Classes" value={stats?.totalClasses || 0} trendLabel="Active classes" />
        <StatCard icon={BarChart3} label="Attendance Rate" value={`${stats?.attendanceRate || 0}%`} trendLabel="Overall system" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
        <div className="page-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Attendance Overview</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="muted">Present</span>
              <strong style={{ color: '#10b981' }}>{stats?.attendancePresent || 0}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="muted">Absent</span>
              <strong style={{ color: '#ef4444' }}>{stats?.attendanceAbsent || 0}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="muted">Late</span>
              <strong style={{ color: '#f59e0b' }}>{stats?.attendanceLate || 0}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="muted">Excused</span>
              <strong style={{ color: '#0369a1' }}>{stats?.attendanceExcused || 0}</strong>
            </div>
          </div>
        </div>

        <div className="page-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Button variant="secondary" onClick={() => navigate('/admin/students')}>
              <Plus size={16} /> Add Student
            </Button>
            <Button variant="secondary" onClick={() => navigate('/admin/teachers')}>
              <Plus size={16} /> Add Teacher
            </Button>
            <Button variant="secondary" onClick={() => navigate('/admin/classes')}>
              <Plus size={16} /> Add Class
            </Button>
            <Button variant="secondary" onClick={() => navigate('/admin/attendance')}>
              View Attendance
            </Button>
          </div>
        </div>

        <div className="page-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>System Stats</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="muted">Total Users</span>
              <strong>{stats?.totalUsers || 0}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="muted">Total Subjects</span>
              <strong>{stats?.totalSubjects || 0}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="muted">Active Sessions</span>
              <strong>{stats?.activeSessions || 0}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
