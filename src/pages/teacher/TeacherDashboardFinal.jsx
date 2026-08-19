import { useEffect, useState } from 'react'
import api from '../../app/api'
import { useAuth } from '../../app/store'
import PageHeader from '../../component/PageHeader'
import StatCard from '../../component/StatCard'
import LoadingSkeleton from '../../component/LoadingSkeleton'
import ErrorState from '../../component/ErrorState'
import { Users, Users2, BookOpen, Calendar } from 'lucide-react'

function TeacherDashboard() {
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
      const { data } = await api.get('/teachers/me/classes')
      setStats({ myClasses: data?.length || 0 })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSkeleton rows={2} columns={3} type="cards" />
  if (error) return <ErrorState message={error} retryAction={fetchDashboard} />

  const userName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Teacher'

  return (
    <div className="dashboard-shell">
      <PageHeader title={`Good morning, ${userName}`} subtitle="Manage your classes and attendance" hero />
      <div className="stats-grid">
        <StatCard icon={BookOpen} label="My Classes" value={stats?.myClasses || 0} />
        <StatCard icon={Users} label="Total Students" value="0" />
        <StatCard icon={Calendar} label="Active Sessions" value="0" />
      </div>
    </div>
  )
}

export default TeacherDashboard
