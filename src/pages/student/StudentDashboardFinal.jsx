import { useEffect, useState } from 'react'
import api from '../../app/api'
import { useAuth } from '../../app/store'
import PageHeader from '../../component/PageHeader'
import StatCard from '../../component/StatCard'
import LoadingSkeleton from '../../component/LoadingSkeleton'
import ErrorState from '../../component/ErrorState'
import { GraduationCap, BarChart3, Calendar, TrendingUp } from 'lucide-react'

function StudentDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      const [attendance, summary] = await Promise.all([
        api.get('/students/me/attendance'),
        api.get('/students/me/attendance/summary'),
      ])
      setStats({
        attendance: attendance.data,
        summary: summary.data,
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSkeleton rows={2} columns={3} type="cards" />
  if (error) return <ErrorState message={error} retryAction={fetchDashboard} />

  const userName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Student'

  return (
    <div className="dashboard-shell">
      <PageHeader title={`Welcome back, ${userName}`} subtitle="Your attendance dashboard" hero />
      <div className="stats-grid">
        <StatCard icon={TrendingUp} label="Attendance Rate" value={`${stats?.summary?.attendancePercentage || 0}%`} />
        <StatCard icon={BarChart3} label="Present" value={stats?.summary?.present || 0} />
        <StatCard icon={Calendar} label="Absent" value={stats?.summary?.absent || 0} />
        <StatCard icon={GraduationCap} label="Classes" value="0" />
      </div>
    </div>
  )
}

export default StudentDashboard
