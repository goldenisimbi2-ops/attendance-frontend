import { useEffect, useState } from 'react'
import { AlertCircle, BookOpen, Info } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import api, { getErrorMessage } from '../../app/api'
import Spinner from '../../component/ui/Spinner'
import Modal from '../../component/ui/Modal'

function MyClasses() {
  const navigate = useNavigate()
  const [classes, setClasses] = useState([])
  const [sessions, setSessions] = useState([])
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [viewingStudentsFor, setViewingStudentsFor] = useState(null)

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      const [classesRes, sessionsRes, recordsRes] = await Promise.all([
        api.get('/teachers/me/classes'),
        api.get('/teachers/me/sessions').catch(() => ({ data: { data: [] } })),
        api.get('/teachers/me/attendance').catch(() => ({ data: { data: [] } })),
      ])
      const rows = classesRes.data?.data || classesRes.data?.classes || (Array.isArray(classesRes.data) ? classesRes.data : [])
      setClasses(rows)
      const sessionRows = sessionsRes.data?.data || []
      setSessions(Array.isArray(sessionRows) ? sessionRows : [])
      const recordRows = recordsRes.data?.data || []
      setRecords(Array.isArray(recordRows) ? recordRows : [])
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
        <h3>Loading assigned classes...</h3>
      </div>
    )
  }

  // Build lookup tables from real session/record data.
  const sessionsByAssignment = {}
  sessions.forEach((session) => {
    const key = session.classSubjectId
    if (!sessionsByAssignment[key]) sessionsByAssignment[key] = []
    sessionsByAssignment[key].push(session)
  })

  const enriched = classes.map((item) => {
    const assignmentSessions = sessionsByAssignment[item.id] || []
    const sessionIds = new Set(assignmentSessions.map((s) => s.id))
    const assignmentRecords = records.filter((r) => sessionIds.has(r.attendanceSessionId))
    const marked = assignmentRecords.length
    const present = assignmentRecords.filter((r) => r.status === 'present' || r.status === 'late').length
    const rate = marked > 0 ? Math.round((present / marked) * 100) : null
    const todayStr = new Date().toISOString().split('T')[0]
    const nextSession = assignmentSessions
      .filter((s) => s.date && String(s.date) >= todayStr)
      .sort((a, b) => (String(a.date) > String(b.date) ? 1 : -1))[0]

    return {
      ...item,
      sessions: assignmentSessions,
      studentCount: item.class?.students?.length ?? item.studentCount ?? null,
      attendanceRate: rate,
      nextSession,
    }
  })

  return (
    <div className="dashboard-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">Class Management</p>
          <h2>My Assigned Classes</h2>
          <p className="muted">Overview of all classes and subjects assigned to you for attendance tracking.</p>
        </div>
      </div>

      {error ? (
        <div className="error-state">
          <AlertCircle size={32} className="text-danger" />
          <h3>Unable to load classes</h3>
          <p>{error}</p>
          <button type="button" className="btn btn-primary" onClick={loadData}>
            Retry
          </button>
        </div>
      ) : enriched.length === 0 ? (
        <div className="empty-state">
          <BookOpen size={48} className="muted" />
          <h3>No assigned classes found</h3>
          <p>You currently do not have any active class assignments.</p>
        </div>
      ) : (
        <div className="cards-grid">
          {enriched.map((item) => {
            const className = item.class?.name || item.className || item.name || '—'
            const classCode = item.class?.code || item.classCode || '—'
            const subjectName = item.subject?.name || item.subjectName || '—'

            return (
              <div key={item.id} className="session-card">
                <div className="session-card__header">
                  <strong>{className}</strong>
                  <span className="badge badge--primary">{classCode}</span>
                </div>
                <div className="session-card__body">
                  <p><strong>Subject:</strong> {subjectName}</p>
                  <p><strong>Enrolled Students:</strong> {item.studentCount != null ? item.studentCount : '—'}</p>
                  <p><strong>Attendance Rate:</strong> {item.attendanceRate != null ? `${item.attendanceRate}%` : '—'}</p>
                  <p>
                    <strong>Next Session:</strong>{' '}
                    {item.nextSession
                      ? `${item.nextSession.date} • ${item.nextSession.startTime || '—'}`
                      : '—'}
                  </p>
                </div>
                <div className="session-card__footer" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                    onClick={() => navigate('/teacher/sessions')}
                  >
                    View Class Sessions
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                    onClick={() => setViewingStudentsFor(item)}
                  >
                    View Students
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="inline-note">
        <Info size={15} />
        <span>
          Student counts and per-class attendance rates are derived from your real sessions and records. Exact enrolled
          counts require the backend to include class/student associations in the class-subject response.
        </span>
      </div>

      <Modal
        isOpen={!!viewingStudentsFor}
        onClose={() => setViewingStudentsFor(null)}
        title={`Enrolled Students - ${viewingStudentsFor?.class?.name || 'Class'}`}
      >
        {viewingStudentsFor && (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Gender</th>
                  <th>Date of Birth</th>
                </tr>
              </thead>
              <tbody>
                {viewingStudentsFor.class?.students && viewingStudentsFor.class.students.length > 0 ? (
                  viewingStudentsFor.class.students.map((student) => (
                    <tr key={student.id}>
                      <td>{student.user?.firstName} {student.user?.lastName}</td>
                      <td>{student.gender || '—'}</td>
                      <td>{student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : '—'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center' }} className="muted">
                      No students found in this class.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default MyClasses
