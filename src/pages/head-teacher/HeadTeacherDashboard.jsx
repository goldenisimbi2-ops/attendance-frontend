import { useEffect, useState } from 'react'
import {
  BarChart3,
  BookOpen,
  CalendarCheck2,
  CheckCircle2,
  GraduationCap,
  Info,
  UserRound,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import api from '../../app/api'
import StatCard from '../../component/StatCard'
import LoadingSkeleton from '../../component/LoadingSkeleton'
import ErrorState from '../../component/ErrorState'
import EmptyState from '../../component/EmptyState'

// Backend wraps responses as { success, data: ... }.
function unwrap(payload) {
  if (payload && typeof payload === 'object' && 'data' in payload) return payload.data ?? payload
  return payload
}

function HeadTeacherDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const { data } = await api.get('/dashboard')
      setStats(unwrap(data) || {})
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="dashboard-shell">
        <LoadingSkeleton rows={2} columns={8} type="cards" />
        <LoadingSkeleton rows={5} columns={6} />
      </div>
    )
  }

  const n = (value) => (value == null ? '—' : value)

  return (
    <div className="dashboard-shell">
      <div className="welcome-hero">
        <div>
          <p className="welcome-hero__eyebrow">Head teacher portal</p>
          <h1>Welcome back</h1>
          <p>Monitor attendance across classes, students, and teachers.</p>
        </div>
        <div className="welcome-hero__actions">
          <button type="button" className="btn btn-primary" onClick={() => navigate('/head-teacher/monitoring')}>Attendance Monitoring</button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/head-teacher/reports')}>Attendance Reports</button>
        </div>
      </div>

      <div className="notice-banner">
        <Info size={22} style={{ flex: 'none', marginTop: '2px' }} />
        <div>
          <h3>Head teacher monitoring needs backend support</h3>
          <p>
            The backend only authorizes <code>admin</code>, <code>teacher</code>, and <code>student</code>. Add a
            <code>head_teacher</code> role and school-wide read endpoints (dashboard, attendance, classes,
            students/low-attendance, teachers, reports) so real data can be shown. No fabricated statistics are displayed.
          </p>
        </div>
      </div>

      {error ? (
        <ErrorState message={error.message} retryAction={loadData} status={error.status} />
      ) : (
        <>
          <div className="stats-grid stats-grid--auto">
            <StatCard icon={GraduationCap} label="Total Students" value={n(stats?.totalStudents)} trendLabel="School-wide" />
            <StatCard icon={UserRound} label="Total Teachers" value={n(stats?.totalTeachers)} trendLabel="School-wide" />
            <StatCard icon={BookOpen} label="Total Classes" value={n(stats?.totalClasses)} trendLabel="School-wide" />
            <StatCard icon={CalendarCheck2} label="Total Sessions" value={n(stats?.totalSessions)} trendLabel="Scheduled" />
            <StatCard icon={CheckCircle2} label="Present" value={n(stats?.present)} trendLabel="All records" />
            <StatCard icon={UserRound} label="Absent" value={n(stats?.absent)} trendLabel="All records" />
            <StatCard icon={BarChart3} label="Late" value={n(stats?.late)} trendLabel="All records" />
            <StatCard icon={BarChart3} label="Overall Attendance" value={stats?.overallAttendance != null ? `${Math.round(stats.overallAttendance)}%` : '—'} trendLabel="Rate" />
          </div>

          <section className="panel">
            <div className="panel__header">
              <h3>Today&apos;s Attendance Overview</h3>
            </div>
            <EmptyState
              icon={CalendarCheck2}
              title="No per-class attendance data available"
              message="A school-wide endpoint returning each class with its teacher, subject, total students, and today’s present / absent / late counts is required."
            />
          </section>

          <div className="content-grid content-grid--two">
            <section className="panel">
              <div className="panel__header"><h3>Class Attendance Performance</h3></div>
              <EmptyState icon={BookOpen} title="No class performance data" message="Class-by-class attendance rates will appear here once the backend endpoint is available." />
            </section>

            <section className="panel">
              <div className="panel__header">
                <div>
                  <h3>Students With Low Attendance</h3>
                  <span className="muted small-text">Students requiring follow-up</span>
                </div>
              </div>
              <EmptyState
                icon={GraduationCap}
                title="No low-attendance data"
                message="Students below the attendance threshold will be listed here when the backend provides it."
                action={() => navigate('/head-teacher/students')}
                actionLabel="Open students page"
              />
            </section>
          </div>
        </>
      )}
    </div>
  )
}

export default HeadTeacherDashboard
