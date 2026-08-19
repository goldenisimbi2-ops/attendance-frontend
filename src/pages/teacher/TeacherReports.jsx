import { useEffect, useState } from 'react'
import { AlertCircle, BarChart3, TrendingUp, UserCheck, UserX } from 'lucide-react'
import api, { getErrorMessage } from '../../app/api'
import Spinner from '../../component/ui/Spinner'

function TeacherReports() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const res = await api.get('/teachers/me/attendance').catch(() => api.get('/attendance'))
        setRecords(res.data?.data || res.data?.records || [])
      } catch (err) {
        setError(getErrorMessage(err))
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
        <h3>Loading attendance reports...</h3>
      </div>
    )
  }

  const present = records.filter((r) => r.status === 'present').length
  const absent = records.filter((r) => r.status === 'absent').length
  const late = records.filter((r) => r.status === 'late').length
  const total = records.length
  const rate = total > 0 ? Math.round(((present + late) / total) * 100) : 0

  return (
    <div className="dashboard-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">Class Analytics</p>
          <h2>Attendance Reports</h2>
          <p className="muted">Detailed trends and statistics for your classes.</p>
        </div>
      </div>

      {error ? (
        <div className="error-state">
          <AlertCircle size={32} className="text-danger" />
          <h3>Unable to load reports</h3>
          <p>{error}</p>
        </div>
      ) : (
        <>
          <div className="stats-grid stats-grid--four">
            <article className="metric-card">
              <div className="metric-card__icon metric-card__icon--primary"><BarChart3 size={20} /></div>
              <div className="metric-card__content"><span>ATTENDANCE RATE</span><strong>{rate}%</strong></div>
            </article>
            <article className="metric-card">
              <div className="metric-card__icon metric-card__icon--success"><UserCheck size={20} /></div>
              <div className="metric-card__content"><span>TOTAL PRESENT</span><strong>{present}</strong></div>
            </article>
            <article className="metric-card">
              <div className="metric-card__icon metric-card__icon--danger"><UserX size={20} /></div>
              <div className="metric-card__content"><span>TOTAL ABSENT</span><strong>{absent}</strong></div>
            </article>
            <article className="metric-card">
              <div className="metric-card__icon metric-card__icon--warning"><TrendingUp size={20} /></div>
              <div className="metric-card__content"><span>LATE ARRIVALS</span><strong>{late}</strong></div>
            </article>
          </div>

          <section className="panel mt-4">
            <div className="panel__header">
              <h3>Attendance Summary</h3>
            </div>
            <div className="progress-bar-large mt-2">
              <div className="progress-bar-large__fill" style={{ width: `${rate}%` }}></div>
            </div>
            <p className="muted mt-2">Overall class attendance rate is currently at {rate}%.</p>
          </section>
        </>
      )}
    </div>
  )
}

export default TeacherReports