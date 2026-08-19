import { useEffect, useState } from 'react'
import { AlertCircle, CalendarCheck2, CheckCircle2, Clock, PlusCircle, XCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import api, { getErrorMessage } from '../../app/api'
import Spinner from '../../component/ui/Spinner'

function AttendanceSessions() {
  const navigate = useNavigate()
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadSessions = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await api.get('/teachers/me/sessions').catch(() => api.get('/attendance-sessions'))
      const rows = res.data?.data || res.data?.sessions || (Array.isArray(res.data) ? res.data : [])
      setSessions(rows)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSessions()
  }, [])

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/attendance-sessions/${id}/status`, { status })
      loadSessions()
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  if (loading) {
    return (
      <div className="loading-card">
        <Spinner size="large" />
        <h3>Loading attendance sessions...</h3>
      </div>
    )
  }

  const renderBadge = (status) => {
    const s = (status || 'open').toLowerCase()
    if (s === 'open') return <span className="badge badge--success"><CheckCircle2 size={13} /> OPEN</span>
    if (s === 'closed') return <span className="badge badge--secondary"><Clock size={13} /> CLOSED</span>
    return <span className="badge badge--danger"><XCircle size={13} /> CANCELLED</span>
  }

  return (
    <div className="dashboard-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">Session Management</p>
          <h2>Attendance Sessions</h2>
          <p className="muted">Manage and mark attendance for active or past classroom sessions.</p>
        </div>
        <div>
          <button type="button" className="btn btn-primary" onClick={() => navigate('/teacher/sessions/create')}>
            <PlusCircle size={18} /> Create Session
          </button>
        </div>
      </div>

      {error ? (
        <div className="error-state">
          <AlertCircle size={32} className="text-danger" />
          <h3>Unable to load sessions</h3>
          <p>{error}</p>
          <button type="button" className="btn btn-primary" onClick={loadSessions}>
            Retry
          </button>
        </div>
      ) : sessions.length === 0 ? (
        <div className="empty-state">
          <CalendarCheck2 size={48} className="muted" />
          <h3>No attendance sessions found</h3>
          <p>Create a session to start tracking classroom attendance.</p>
          <button type="button" className="btn btn-primary mt-2" onClick={() => navigate('/teacher/sessions/create')}>
            <PlusCircle size={16} /> Create First Session
          </button>
        </div>
      ) : (
        <section className="panel">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Session Title</th>
                  <th>Class & Subject</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => {
                  const title = session.title || 'Class Session'
                  const className = session.classSubject?.class?.name || session.className || 'Class'
                  const subjectName = session.classSubject?.subject?.name || session.subjectName || 'Subject'
                  const dateStr = session.date ? new Date(session.date).toLocaleDateString() : 'N/A'
                  const timeStr = `${session.startTime || '08:00 AM'} - ${session.endTime || '09:00 AM'}`

                  return (
                    <tr key={session.id}>
                      <td><strong>{title}</strong></td>
                      <td>{className} • {subjectName}</td>
                      <td>{dateStr} ({timeStr})</td>
                      <td>{renderBadge(session.status)}</td>
                      <td>
                        <div className="button-group">
                          <button
                            type="button"
                            className="btn btn-sm btn-primary"
                            onClick={() => navigate(`/teacher/attendance?sessionId=${session.id}`)}
                          >
                            Mark Attendance
                          </button>
                          {session.status === 'open' ? (
                            <button
                              type="button"
                              className="btn btn-sm btn-outline"
                              onClick={() => updateStatus(session.id, 'closed')}
                            >
                              Close Session
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="btn btn-sm btn-outline"
                              onClick={() => updateStatus(session.id, 'open')}
                            >
                              Reopen
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  )
}

export default AttendanceSessions
