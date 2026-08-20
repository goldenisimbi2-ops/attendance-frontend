import { useEffect, useState } from 'react'
import { GraduationCap, UserRound, BookOpen, BarChart3, Plus, Users, CalendarCheck2, ArrowRight, Key } from 'lucide-react'
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
  const [keys, setKeys] = useState([])
  const [keyRole, setKeyRole] = useState('teacher')
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      setError(null)
      const [dashRes, keysRes] = await Promise.all([
        api.get('/dashboard'),
        api.get('/registration-keys')
      ])
      setStats(dashRes.data?.data || dashRes.data)
      if (keysRes.data.success) {
        setKeys(keysRes.data.data)
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateKey = async (e) => {
    e.preventDefault()
    try {
      setIsGenerating(true)
      const { data } = await api.post('/registration-keys', { role: keyRole })
      if (data.success) {
        setKeys([data.data, ...keys])
      }
    } catch (err) {
      alert(err.message || 'Failed to generate key')
    } finally {
      setIsGenerating(false)
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
        {stats?.totals?.map(({ key, label, value, icon: IconName }) => {
          let Icon = BarChart3;
          if (IconName === 'Users') Icon = Users;
          if (IconName === 'UserRound') Icon = UserRound;
          if (IconName === 'GraduationCap') Icon = GraduationCap;
          if (IconName === 'BookOpen') Icon = BookOpen;
          return (
            <article key={key} className="metric-card">
              <div className="metric-card__icon"><Icon size={20} /></div>
              <div className="metric-card__content">
                <span>{label}</span>
                <strong>{value}</strong>
                <small>Updated today</small>
              </div>
            </article>
          )
        })}
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
            <button type="button" className="text-button" onClick={() => navigate('/admin/attendance')}>See all</button>
          </div>

          <div className="session-list">
            {!stats?.recentSessions || stats.recentSessions.length === 0 ? (
              <p style={{ padding: '16px', color: '#666' }}>No recent sessions found.</p>
            ) : (
              stats.recentSessions.map(session => (
                <div key={session.id} className="session-row">
                  <div>
                    <strong>{session.title}</strong>
                    <span>{session.subtitle}</span>
                  </div>
                  <span className={`badge badge--${session.status === 'open' ? 'success' : session.status === 'closed' ? 'info' : 'warning'}`}>
                    {session.statusLabel}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="panel">
          <div className="panel__header">
            <h3>Quick actions</h3>
          </div>
          <div className="action-grid">
            <button type="button" className="action-button" onClick={() => navigate('/admin/students')}><Plus size={16} /> Add Student</button>
            <button type="button" className="action-button" onClick={() => navigate('/admin/teachers')}><Users size={16} /> Add Teacher</button>
            <button type="button" className="action-button" onClick={() => navigate('/admin/classes')}><BookOpen size={16} /> Create Class</button>
            <button type="button" className="action-button" onClick={() => navigate('/admin/subjects')}><CalendarCheck2 size={16} /> Create Subject</button>
            <button type="button" className="action-button action-button--wide" onClick={() => navigate('/admin/attendance')}><ArrowRight size={16} /> View Attendance</button>
          </div>
        </section>
      </div>

      <div className="content-grid">
        <section className="panel">
          <div className="panel__header">
            <h3>Registration Keys</h3>
            <form onSubmit={handleGenerateKey} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <select value={keyRole} onChange={e => setKeyRole(e.target.value)} style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc' }}>
                <option value="teacher">Teacher</option>
                <option value="head_teacher">Head Teacher</option>
                <option value="admin">Admin</option>
              </select>
              <Button type="submit" disabled={isGenerating}><Key size={16} /> Generate</Button>
            </form>
          </div>
          
          <div className="session-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {keys.length === 0 && <p style={{ padding: '16px', color: '#666' }}>No registration keys generated yet.</p>}
            {keys.map(k => (
              <div key={k.id} className="session-row">
                <div>
                  <strong>{k.key}</strong>
                  <span>Role: {k.role.replace('_', ' ')} • Created by {k.creator?.firstName}</span>
                </div>
                {k.isUsed ? (
                  <span className="badge badge--danger">Used by {k.user?.firstName} {k.user?.lastName}</span>
                ) : (
                  <span className="badge badge--success">Available</span>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default AdminDashboard
