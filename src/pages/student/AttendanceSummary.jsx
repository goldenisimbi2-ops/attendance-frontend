import { useEffect, useState } from 'react'
import { AlertCircle, BarChart3, BookOpen, Clock3, UserCheck, UserX } from 'lucide-react'
import api, { getErrorMessage } from '../../app/api'
import Spinner from '../../component/ui/Spinner'

function AttendanceSummary() {
  const [summary, setSummary] = useState(null)
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      const [summaryRes, recordsRes] = await Promise.all([
        api.get('/students/me/attendance/summary'),
        api.get('/students/me/attendance'),
      ])
      setSummary(summaryRes.data?.data || summaryRes.data?.summary || summaryRes.data)
      setRecords(recordsRes.data?.data || [])
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="loading-card">
        <Spinner size="large" />
        <h3>Loading attendance summary...</h3>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-state">
        <AlertCircle size={32} className="text-danger" />
        <h3>Unable to load attendance summary</h3>
        <p>{error}</p>
        <button type="button" className="btn btn-primary" onClick={loadData}>
          Retry
        </button>
      </div>
    )
  }

  const attendanceRate = summary?.attendancePercentage !== undefined ? Math.round(summary.attendancePercentage) : 0

  // Calculate subject breakdown dynamically from records
  const subjectMap = {}
  records.forEach((r) => {
    const subjectName = r.session?.classSubject?.subject?.name || r.session?.title || 'General'
    if (!subjectMap[subjectName]) {
      subjectMap[subjectName] = { total: 0, present: 0, late: 0, absent: 0, excused: 0 }
    }
    subjectMap[subjectName].total += 1
    const s = (r.status || '').toLowerCase()
    if (s === 'present') subjectMap[subjectName].present += 1
    else if (s === 'late') subjectMap[subjectName].late += 1
    else if (s === 'absent') subjectMap[subjectName].absent += 1
    else if (s === 'excused') subjectMap[subjectName].excused += 1
  })

  const subjectStats = Object.keys(subjectMap).map((name) => {
    const data = subjectMap[name]
    const marked = data.present + data.late + data.absent + data.excused
    const rate = marked > 0 ? Math.round(((data.present + data.late) / marked) * 100) : 0
    return { name, rate, ...data }
  })

  return (
    <div className="dashboard-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">Academic Performance</p>
          <h2>Attendance Summary</h2>
          <p className="muted">Detailed breakdown of overall attendance rate and subject performance.</p>
        </div>
      </div>

      <div className="stats-grid stats-grid--five">
        <article className="metric-card">
          <div className="metric-card__icon metric-card__icon--primary"><BarChart3 size={20} /></div>
          <div className="metric-card__content">
            <span>OVERALL RATE</span>
            <strong>{attendanceRate}%</strong>
            <small>Combined average</small>
          </div>
        </article>

        <article className="metric-card">
          <div className="metric-card__icon metric-card__icon--success"><UserCheck size={20} /></div>
          <div className="metric-card__content">
            <span>PRESENT</span>
            <strong>{summary?.present ?? 0}</strong>
            <small>Total present</small>
          </div>
        </article>

        <article className="metric-card">
          <div className="metric-card__icon metric-card__icon--danger"><UserX size={20} /></div>
          <div className="metric-card__content">
            <span>ABSENT</span>
            <strong>{summary?.absent ?? 0}</strong>
            <small>Total absent</small>
          </div>
        </article>

        <article className="metric-card">
          <div className="metric-card__icon metric-card__icon--warning"><Clock3 size={20} /></div>
          <div className="metric-card__content">
            <span>LATE</span>
            <strong>{summary?.late ?? 0}</strong>
            <small>Total late</small>
          </div>
        </article>

        <article className="metric-card">
          <div className="metric-card__icon metric-card__icon--info"><AlertCircle size={20} /></div>
          <div className="metric-card__content">
            <span>EXCUSED</span>
            <strong>{summary?.excused ?? 0}</strong>
            <small>Total excused</small>
          </div>
        </article>
      </div>

      <div className="content-grid content-grid--two">
        <section className="panel">
          <div className="panel__header">
            <h3>Visual Attendance Rate</h3>
          </div>
          <div className="progress-ring-card">
            <div className="progress-bar-large">
              <div className="progress-bar-large__fill" style={{ width: `${attendanceRate}%` }}></div>
            </div>
            <div className="progress-bar-meta">
              <span>0%</span>
              <strong>{attendanceRate}% Target Status</strong>
              <span>100%</span>
            </div>
            <p className="muted small-text mt-2">
              {attendanceRate >= 85
                ? 'Excellent attendance! You meet the recommended academic attendance criteria.'
                : 'Attention needed: Maintain regular attendance to avoid academic warnings.'}
            </p>
          </div>
        </section>

        <section className="panel">
          <div className="panel__header">
            <h3>Attendance by Subject</h3>
          </div>
          {subjectStats.length === 0 ? (
            <div className="empty-state">
              <BookOpen size={36} className="muted" />
              <h4>No subject data available</h4>
              <p>Subject performance will be calculated automatically as records are created.</p>
            </div>
          ) : (
            <div className="subject-progress-list">
              {subjectStats.map((item) => (
                <div key={item.name} className="subject-progress-item">
                  <div className="subject-progress-header">
                    <strong>{item.name}</strong>
                    <span>{item.rate}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className={`progress-bar__fill ${
                        item.rate >= 85 ? 'progress-bar__fill--success' : item.rate >= 70 ? 'progress-bar__fill--warning' : 'progress-bar__fill--danger'
                      }`}
                      style={{ width: `${item.rate}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default AttendanceSummary
