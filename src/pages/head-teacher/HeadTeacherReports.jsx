import { useEffect, useState } from 'react'
import { BarChart3, TrendingUp, Users } from 'lucide-react'
import api from '../../app/api'
import Spinner from '../../component/ui/Spinner'

function HeadTeacherReports() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const res = await api.get('/dashboard').catch(() => ({ data: { data: null } }))
        setData(res.data?.data || {})
      } catch {
        // Fallback to default metrics
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="loading-card">
        <Spinner size="large" />
        <h3>Loading school-wide analytics...</h3>
      </div>
    )
  }

  const rate = data?.overallAttendance !== undefined ? Math.round(data.overallAttendance) : null

  return (
    <div className="dashboard-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">Institutional Analytics</p>
          <h2>Head Teacher Attendance Reports</h2>
          <p className="muted">Analytics across classes, subjects, and student cohorts.</p>
        </div>
      </div>

      <div className="stats-grid stats-grid--four">
        <article className="metric-card">
          <div className="metric-card__icon metric-card__icon--primary"><BarChart3 size={20} /></div>
          <div className="metric-card__content"><span>SCHOOL ATTENDANCE RATE</span><strong>{rate != null ? `${rate}%` : '—'}</strong></div>
        </article>
        <article className="metric-card">
          <div className="metric-card__icon metric-card__icon--success"><Users size={20} /></div>
          <div className="metric-card__content"><span>TOTAL RECORDS</span><strong>{data?.totalRecords ?? '—'}</strong></div>
        </article>
        <article className="metric-card">
          <div className="metric-card__icon metric-card__icon--warning"><TrendingUp size={20} /></div>
          <div className="metric-card__content"><span>ACTIVE SESSIONS</span><strong>{data?.totalSessions ?? '—'}</strong></div>
        </article>
      </div>

      <section className="panel mt-4">
        <div className="panel__header">
          <h3>Overall School Attendance Progress</h3>
        </div>
        <div className="progress-bar-large mt-2">
          <div className="progress-bar-large__fill" style={{ width: `${rate != null ? rate : 0}%` }}></div>
        </div>
        <p className="muted mt-2">The school-wide attendance rate is currently {rate != null ? `${rate}%` : '—'}.</p>
      </section>
    </div>
  )
}

export default HeadTeacherReports