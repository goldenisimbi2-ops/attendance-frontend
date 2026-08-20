import { useEffect, useMemo, useState } from 'react'
import { AlertCircle, CheckCircle2, Save, Users } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import api, { getErrorMessage } from '../../app/api'
import Spinner from '../../component/ui/Spinner'

function MarkAttendance() {
  const [searchParams, setSearchParams] = useSearchParams()
  const sessionId = searchParams.get('sessionId')

  const [sessions, setSessions] = useState([])
  const [sessionDetail, setSessionDetail] = useState(null)
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [error, setError] = useState('')

  // Load active sessions list for dropdown selection
  useEffect(() => {
    const loadSessions = async () => {
      try {
        const res = await api.get('/teachers/me/sessions').catch(() => api.get('/attendance-sessions'))
        const rows = res.data?.data || res.data?.sessions || (Array.isArray(res.data) ? res.data : [])
        setSessions(rows)
        if (!sessionId && rows.length > 0) {
          setSearchParams({ sessionId: rows[0].id })
        }
      } catch (err) {
        console.error(getErrorMessage(err))
      }
    }
    loadSessions()
  }, [sessionId, setSearchParams])

  useEffect(() => {
    const loadSessionData = async () => {
      if (!sessionId) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError('')
        setSuccessMsg('')

        const [sessionRes, recordsRes] = await Promise.all([
          api.get(`/attendance-sessions/${sessionId}`).catch(() => ({ data: { data: null } })),
          api.get(`/attendance/session/${sessionId}`).catch(() => ({ data: { data: [] } })),
        ])

        const sData = sessionRes.data?.data || sessionRes.data || {}
        setSessionDetail(sData)
        const records = recordsRes.data?.data || []
        
        let studentUsers = []
        const classId = sData.classSubject?.classId || sData.classSubject?.class?.id
        if (classId) {
          const usersRes = await api.get(`/classes/${classId}/students`).catch(() => ({ data: { data: [] } }))
          studentUsers = usersRes.data?.data || []
        }

        if (records.length > 0) {
          setStudents(
            records.map((r) => ({
              id: r.studentId || r.student?.id,
              studentName: r.student ? `${r.student.firstName} ${r.student.lastName || ''}`.trim() : r.studentName || 'Student',
              studentNumber: r.student?.studentProfile?.studentNumber || r.studentNumber || 'STD-100',
              status: r.status || 'present',
              remarks: r.remarks || '',
            })),
          )
        } else if (studentUsers.length > 0) {
          setStudents(
            studentUsers.map((s) => ({
              id: s.id,
              studentName: `${s.firstName} ${s.lastName || ''}`.trim(),
              studentNumber: s.studentProfile?.studentNumber || 'STD-100',
              status: 'present',
              remarks: '',
            })),
          )
        } else {
          setStudents([])
        }
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }

    loadSessionData()
  }, [sessionId, setSearchParams])

  const setStudentStatus = (id, status) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)))
  }

  const setStudentRemarks = (id, remarks) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, remarks } : s)))
  }

  const markAll = (status) => {
    setStudents((prev) => prev.map((s) => ({ ...s, status })))
  }

  const resetAll = () => {
    setStudents((prev) => prev.map((s) => ({ ...s, status: 'present', remarks: '' })))
  }

  const handleSave = async () => {
    if (!sessionId) return
    try {
      setSaving(true)
      setError('')
      setSuccessMsg('')

      await api.post('/attendance/bulk', {
        sessionId,
        records: students.map((s) => ({
          studentId: s.id,
          status: s.status,
          remarks: s.remarks || '',
        })),
      })

      setSuccessMsg('Attendance saved successfully.')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const stats = useMemo(() => {
    const present = students.filter((s) => s.status === 'present').length
    const absent = students.filter((s) => s.status === 'absent').length
    const late = students.filter((s) => s.status === 'late').length
    const excused = students.filter((s) => s.status === 'excused').length
    return { present, absent, late, excused }
  }, [students])

  if (loading) {
    return (
      <div className="loading-card">
        <Spinner size="large" />
        <h3>Loading student roster for marking...</h3>
      </div>
    )
  }

  return (
    <div className="dashboard-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">Attendance Sheet</p>
          <h2>Mark Attendance</h2>
          <p className="muted">
            {sessionDetail?.title ? `${sessionDetail.title} • ${sessionDetail.date || 'Today'}` : 'Select a session and mark student attendance.'}
          </p>
        </div>

        {sessions.length > 0 && (
          <div className="session-selector">
            <label htmlFor="select-session" className="sr-only">Select Session</label>
            <select
              id="select-session"
              value={sessionId || ''}
              onChange={(e) => setSearchParams({ sessionId: e.target.value })}
              className="select-field"
            >
              {sessions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title || 'Session'} ({s.date || 'Today'})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="stats-grid stats-grid--four">
        <div className="metric-card">
          <div className="metric-card__content"><span>PRESENT</span><strong className="text-success">{stats.present}</strong></div>
        </div>
        <div className="metric-card">
          <div className="metric-card__content"><span>ABSENT</span><strong className="text-danger">{stats.absent}</strong></div>
        </div>
        <div className="metric-card">
          <div className="metric-card__content"><span>LATE</span><strong className="text-warning">{stats.late}</strong></div>
        </div>
        <div className="metric-card">
          <div className="metric-card__content"><span>EXCUSED</span><strong className="text-info">{stats.excused}</strong></div>
        </div>
      </div>

      {successMsg ? (
        <div className="message-box message-box--success" style={{ marginBottom: '1rem' }}>
          <CheckCircle2 size={18} /> {successMsg}
        </div>
      ) : null}

      {error ? (
        <div className="message-box message-box--danger" style={{ marginBottom: '1rem' }}>
          <AlertCircle size={18} /> {error}
        </div>
      ) : null}

      <section className="panel">
        <div className="panel__header">
          <div>
            <h3>Student Roster</h3>
            <span className="muted small-text">{students.length} students enrolled</span>
          </div>
          <div className="button-group">
            <button type="button" className="btn btn-sm btn-outline" onClick={() => markAll('present')}>
              Mark All Present
            </button>
            <button type="button" className="btn btn-sm btn-outline" onClick={() => markAll('absent')}>
              Mark All Absent
            </button>
            <button type="button" className="btn btn-sm btn-outline" onClick={resetAll}>
              Reset
            </button>
          </div>
        </div>

        {students.length === 0 ? (
          <div className="empty-state">
            <Users size={36} className="muted" />
            <h4>No students found for this session</h4>
            <p>Make sure students are registered in this class.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Student ID</th>
                  <th>Attendance Status</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {students.map((st) => (
                  <tr key={st.id}>
                    <td><strong>{st.studentName}</strong></td>
                    <td>{st.studentNumber}</td>
                    <td>
                      <div className="status-toggle-group">
                        <button
                          type="button"
                          className={`toggle-btn toggle-btn--success ${st.status === 'present' ? 'active' : ''}`}
                          onClick={() => setStudentStatus(st.id, 'present')}
                        >
                          PRESENT
                        </button>
                        <button
                          type="button"
                          className={`toggle-btn toggle-btn--danger ${st.status === 'absent' ? 'active' : ''}`}
                          onClick={() => setStudentStatus(st.id, 'absent')}
                        >
                          ABSENT
                        </button>
                        <button
                          type="button"
                          className={`toggle-btn toggle-btn--warning ${st.status === 'late' ? 'active' : ''}`}
                          onClick={() => setStudentStatus(st.id, 'late')}
                        >
                          LATE
                        </button>
                        <button
                          type="button"
                          className={`toggle-btn toggle-btn--info ${st.status === 'excused' ? 'active' : ''}`}
                          onClick={() => setStudentStatus(st.id, 'excused')}
                        >
                          EXCUSED
                        </button>
                      </div>
                    </td>
                    <td>
                      <input
                        type="text"
                        value={st.remarks}
                        onChange={(e) => setStudentRemarks(st.id, e.target.value)}
                        placeholder="Optional remark..."
                        className="input-field input-field--sm"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="panel__footer" style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={handleSave}
            disabled={saving || !sessionId || students.length === 0}
          >
            <Save size={18} />
            {saving ? 'SAVING ATTENDANCE...' : 'SAVE ATTENDANCE'}
          </button>
        </div>
      </section>
    </div>
  )
}

export default MarkAttendance
