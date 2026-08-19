import { useEffect, useState } from 'react'
import api from '../../app/api'
import { useAuth } from '../../app/store'
import PageHeader from '../../component/PageHeader'
import StatCard from '../../component/StatCard'
import DataTable from '../../component/DataTable'
import LoadingSkeleton from '../../component/LoadingSkeleton'
import ErrorState from '../../component/ErrorState'
import StatusBadge from '../../component/StatusBadge'
import { TrendingUp, BarChart3, Calendar, CheckCircle } from 'lucide-react'

function StudentDashboardDetailed() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      const [summary, records] = await Promise.all([api.get('/students/me/attendance/summary'), api.get('/students/me/attendance')])
      setStats(summary.data)
      setAttendance(Array.isArray(records.data) ? records.data : [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSkeleton rows={3} columns={4} type="cards" />
  if (error) return <ErrorState message={error} retryAction={fetchDashboard} />

  const userName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Student'

  const columns = [
    { key: 'subject', label: 'Subject' },
    { key: 'date', label: 'Date' },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
  ]

  return (
    <div className="dashboard-shell">
      <PageHeader title={`Welcome back, ${userName}`} subtitle="Your attendance overview" hero />
      <div className="stats-grid stats-grid--four">
        <StatCard icon={TrendingUp} label="Overall Attendance" value={`${stats?.attendancePercentage || 0}%`} />
        <StatCard icon={CheckCircle} label="Present" value={stats?.present || 0} />
        <StatCard icon={BarChart3} label="Absent" value={stats?.absent || 0} />
        <StatCard icon={Calendar} label="Late" value={stats?.late || 0} />
      </div>
      <div className="page-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Recent Attendance Records</h3>
        <DataTable columns={columns} data={attendance.slice(0, 10)} />
      </div>
    </div>
  )
}

export default StudentDashboardDetailed
