import { useEffect, useState } from 'react'
import api from '../../app/api'
import PageHeader from '../../component/PageHeader'
import LoadingSkeleton from '../../component/LoadingSkeleton'
import ErrorState from '../../component/ErrorState'
import { TrendingUp, CheckCircle, XCircle, Clock } from 'lucide-react'

function AttendanceSummary() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchSummary()
  }, [])

  const fetchSummary = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/students/me/attendance/summary')
      setSummary(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <><PageHeader title="Attendance Summary" /><LoadingSkeleton rows={4} columns={1} type="cards" /></>
  if (error) return <ErrorState message={error} retryAction={fetchSummary} />

  const data = summary || {}
  const total = (data.present || 0) + (data.absent || 0) + (data.late || 0) + (data.excused || 0)

  return (
    <>
      <PageHeader title="Attendance Summary" subtitle="Your attendance statistics" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        <div className="page-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1d4ed8', marginBottom: '0.5rem' }}>{data.attendancePercentage || 0}%</div>
          <p className="muted">Overall Attendance Rate</p>
        </div>
        <div className="page-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <CheckCircle size={32} style={{ color: '#10b981' }} />
            <div>
              <p className="muted">Present</p>
              <strong style={{ fontSize: '1.5rem' }}>{data.present || 0}</strong>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <XCircle size={32} style={{ color: '#ef4444' }} />
            <div>
              <p className="muted">Absent</p>
              <strong style={{ fontSize: '1.5rem' }}>{data.absent || 0}</strong>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Clock size={32} style={{ color: '#f59e0b' }} />
            <div>
              <p className="muted">Late</p>
              <strong style={{ fontSize: '1.5rem' }}>{data.late || 0}</strong>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AttendanceSummary
