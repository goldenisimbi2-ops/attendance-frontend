import { useEffect, useState } from 'react'
import { GraduationCap, UserRound, BookOpen, BarChart3, Plus } from 'lucide-react'
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
      <div className="page-header page-header--hero">
        <div>
          <p className="eyebrow">Good morning, Admin</p>
          <h2>Here’s what’s happening with your attendance system today.</h2>
        </div>
        <div className="page-actions">
          <Button variant="secondary">View reports</Button>
          <Button>Quick action</Button>
        </div>
      </div>

      <div className="stats-grid">
        {totals.map(({ key, label, value, icon: Icon }) => (
          <article key={key} className="metric-card">
            <div className="metric-card__icon"><Icon size={20} /></div>
            <div className="metric-card__content">
              <span>{label}</span>
              <strong>{value}</strong>
              <small>Updated today</small>
            </div>
          </article>
        ))}
      </div>

      <div className="content-grid content-grid--two">
        <section className="panel">
          <div className="panel__header">
            <h3>Attendance overview</h3>
            <span className="pill pill--info">This week</span>
          </div>

          <div className="legend-list">
            <div><span className="legend-dot legend-dot--success" /> Present <strong>{stats.present ?? 0}</strong></div>
            <div><span className="legend-dot legend-dot--danger" /> Absent <strong>{stats.absent ?? 0}</strong></div>
            <div><span className="legend-dot legend-dot--warning" /> Late <strong>{stats.late ?? 0}</strong></div>
            <div><span className="legend-dot legend-dot--info" /> Excused <strong>{stats.excused ?? 0}</strong></div>
          </div>

          <div className="progress-stack">
            <div className="progress-row">
              <label>Present</label>
              <div className="progress"><span style={{ width: `${Math.min((stats.present ?? 0) * 100 / Math.max((stats.present ?? 0) + (stats.absent ?? 0) + (stats.late ?? 0) + (stats.excused ?? 0), 1), 100)}%` }} /></div>
            </div>
            <div className="progress-row">
              <label>Absent</label>
              <div className="progress"><span className="progress--danger" style={{ width: `${Math.min((stats.absent ?? 0) * 100 / Math.max((stats.present ?? 0) + (stats.absent ?? 0) + (stats.late ?? 0) + (stats.excused ?? 0), 1), 100)}%` }} /></div>
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="panel__header">
            <h3>Attendance rate</h3>
            <span className="pill pill--success">{stats.attendancePercentage ?? 0}%</span>
          </div>
          <div className="ring-wrap">
            <div className="progress-ring" style={{ '--value': `${stats.attendancePercentage ?? 0}` }}>
              <div className="progress-ring__inner">
                <strong>{stats.attendancePercentage ?? 0}%</strong>
                <span>Rate</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="content-grid content-grid--two">
        <section className="panel">
          <div className="panel__header">
            <h3>Recent attendance sessions</h3>
            <button type="button" className="text-button">See all</button>
          </div>

          <div className="session-list">
            <div className="session-row">
              <div>
                <strong>Biology Class</strong>
                <span>9:00 AM • Room 205</span>
              </div>
              <span className="badge badge--success">Open</span>
            </div>
            <div className="session-row">
              <div>
                <strong>Math 101</strong>
                <span>11:30 AM • Hall A</span>
              </div>
              <span className="badge badge--warning">Late</span>
            </div>
            <div className="session-row">
              <div>
                <strong>English Literature</strong>
                <span>2:00 PM • Block B</span>
              </div>
              <span className="badge badge--info">Closed</span>
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="panel__header">
            <h3>Quick actions</h3>
          </div>
          <div className="action-grid">
            <button type="button" className="action-button"><Plus size={16} /> Add Student</button>
            <button type="button" className="action-button"><Users size={16} /> Add Teacher</button>
            <button type="button" className="action-button"><BookOpen size={16} /> Create Class</button>
            <button type="button" className="action-button"><CalendarCheck2 size={16} /> Create Subject</button>
            <button type="button" className="action-button action-button--wide"><ArrowRight size={16} /> View Attendance</button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default AdminDashboard
