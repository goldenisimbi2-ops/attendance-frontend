import { useEffect, useState } from 'react'
import { BarChart3, CheckCircle2, Clock3, UserRound } from 'lucide-react'
import api, { getErrorMessage } from '../../app/api'
import Spinner from '../../component/ui/Spinner'

function StudentDashboard() {
  const [student, setStudent] = useState(null)
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const [studentRes, summaryRes] = await Promise.all([
          api.get('/students/me'),
          api.get('/students/me/attendance/summary'),
        ])

        setStudent(studentRes.data.user || studentRes.data)
        setSummary(summaryRes.data.summary || summaryRes.data)
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  if (loading) return <div className="loading-card"><Spinner size="large" /><h3>Loading student dashboard...</h3></div>
  if (error) return <div className="error-state"><h3>Unable to load dashboard</h3><p>{error}</p></div>

  const studentName = `${student?.firstName || 'Student'} ${student?.lastName || ''}`.trim()
  const attendanceRate = summary?.attendancePercentage ?? 0

  return (
    <div className="dashboard-shell">
      <div className="page-header page-header--hero">
        <div>
          <p className="eyebrow">Welcome back, {studentName}</p>
          <h2>Your academic attendance overview is ready.</h2>
        </div>
      </div>

      <div className="stats-grid stats-grid--four">
        <article className="metric-card">
          <div className="metric-card__icon"><BarChart3 size={20} /></div>
          <div className="metric-card__content"><span>Attendance Rate</span><strong>{attendanceRate}%</strong><small>Overall</small></div>
        </article>
        <article className="metric-card">
          <div className="metric-card__icon"><CheckCircle2 size={20} /></div>
          <div className="metric-card__content"><span>Present</span><strong>{summary?.present ?? 0}</strong><small>Marked</small></div>
        </article>
        <article className="metric-card">
          <div className="metric-card__icon"><Clock3 size={20} /></div>
          <div className="metric-card__content"><span>Late</span><strong>{summary?.late ?? 0}</strong><small>Records</small></div>
        </article>
        <article className="metric-card">
          <div className="metric-card__icon"><UserRound size={20} /></div>
          <div className="metric-card__content"><span>Class</span><strong>{student?.className || student?.class || '—'}</strong><small>{student?.studentNumber || 'Student'}</small></div>
        </article>
      </div>

      <div className="content-grid content-grid--two">
        <section className="panel">
          <div className="panel__header"><h3>Attendance progress</h3></div>
          <div className="ring-wrap ring-wrap--large">
            <div className="progress-ring" style={{ '--value': `${attendanceRate}` }}>
              <div className="progress-ring__inner">
                <strong>{attendanceRate}%</strong>
                <span>Attendance rate</span>
              </div>
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="panel__header"><h3>Recent attendance</h3></div>
          <div className="session-list">
            <div className="session-row">
              <div><strong>Mathematics</strong><span>Today • Present</span></div>
              <span className="badge badge--success">Present</span>
            </div>
            <div className="session-row">
              <div><strong>Biology</strong><span>Yesterday • Late</span></div>
              <span className="badge badge--warning">Late</span>
            </div>
            <div className="session-row">
              <div><strong>English</strong><span>Monday • Present</span></div>
              <span className="badge badge--success">Present</span>
            </div>
          </div>
        </section>
      </div>

      <section className="panel">
        <div className="panel__header"><h3>Attendance by subject</h3></div>
        <div className="subject-summary">
          <div className="subject-summary__row"><span>Mathematics</span><strong>96%</strong></div>
          <div className="subject-summary__row"><span>Biology</span><strong>88%</strong></div>
          <div className="subject-summary__row"><span>English</span><strong>92%</strong></div>
        </div>
      </section>
    </div>
  )
}

export default StudentDashboard
