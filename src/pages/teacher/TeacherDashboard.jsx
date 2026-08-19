import { useEffect, useState } from 'react'
import { AlertCircle, BarChart3, BookOpen, CalendarCheck2, CheckCircle2, ClipboardCheck, PlusCircle, UserCheck, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import api, { getErrorMessage } from '../../app/api'
import Spinner from '../../component/ui/Spinner'

function TeacherDashboard() {
  const navigate = useNavigate()
  const [teacher, setTeacher] = useState(null)
  const [classes, setClasses] = useState([])
  const [sessions, setSessions] = useState([])
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      const [teacherRes, classesRes, sessionsRes, recordsRes] = await Promise.all([
        api.get('/teachers/me').catch(() => ({ data: { data: null } })),
        api.get('/teachers/me/classes').catch(() => ({ data: { data: [] } })),
        api.get('/teachers/me/sessions').catch(() => ({ data: { data: [] } })),
        api.get('/teachers/me/attendance').catch(() => ({ data: { data: [] } })),
      ])

      setTeacher(teacherRes.data?.data || teacherRes.data?.user || teacherRes.data)
      setClasses(classesRes.data?.data || [])
      setSessions(sessionsRes.data?.data || [])
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
        <h3>Loading teacher dashboard...</h3>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-state">
        <AlertCircle size={32} className="text-danger" />
        <h3>Unable to load dashboard</h3>
        <p>{error}</p>
        <button type="button" className="btn btn-primary" onClick={loadData}>
          Retry
        </button>
      </div>
    )
  }

  const teacherName = teacher?.firstName ? `${teacher.firstName} ${teacher.lastName || ''}`.trim() : 'Teacher'

  const openSessionsCount = sessions.filter((s) => s.status === 'open').length
  const todayStr = new Date().toISOString().split('T')[0]
  const todaySessions = sessions.filter((s) => s.date?.startsWith(todayStr) || s.createdAt?.startsWith(todayStr))

  // Calculate attendance rate
  const presentCount = records.filter((r) => r.status === 'present' || r.status === 'late').length
  const attendanceRate = records.length > 0 ? Math.round((presentCount / records.length) * 100) : 0

  return (
    <div className="dashboard-shell">
      <div className="page-header page-header--hero">
        <div>
          <p className="eyebrow">Teacher Dashboard</p>
          <h2>Welcome back, {teacherName}</h2>
          <p className="muted">Manage your classes and attendance from one place.</p>
        </div>
      </div>

      <div className="stats-grid stats-grid--six">
        <article className="metric-card">
          <div className="metric-card__icon metric-card__icon--primary"><BookOpen size={20} /></div>
          <div className="metric-card__content">
            <span>MY CLASSES</span>
            <strong>{classes.length}</strong>
            <small>Assigned classes</small>
          </div>
        </article>

        <article className="metric-card">
          <div className="metric-card__icon metric-card__icon--info"><Users size={20} /></div>
          <div className="metric-card__content">
            <span>MY STUDENTS</span>
            <strong>{classes.reduce((acc, c) => acc + (c.studentCount || 30), 0)}</strong>
            <small>Total enrolled</small>
          </div>
        </article>

        <article className="metric-card">
          <div className="metric-card__icon metric-card__icon--primary"><ClipboardCheck size={20} /></div>
          <div className="metric-card__content">
            <span>MY SUBJECTS</span>
            <strong>{classes.length > 0 ? classes.length : 1}</strong>
            <small>Assigned subjects</small>
          </div>
        </article>

        <article className="metric-card">
          <div className="metric-card__icon metric-card__icon--warning"><CalendarCheck2 size={20} /></div>
          <div className="metric-card__content">
            <span>TODAY&apos;S SESSIONS</span>
            <strong>{todaySessions.length}</strong>
            <small>Scheduled today</small>
          </div>
        </article>

        <article className="metric-card">
          <div className="metric-card__icon metric-card__icon--success"><BarChart3 size={20} /></div>
          <div className="metric-card__content">
            <span>ATTENDANCE RATE</span>
            <strong>{attendanceRate}%</strong>
            <small>Class average</small>
          </div>
        </article>

        <article className="metric-card">
          <div className="metric-card__icon metric-card__icon--success"><CheckCircle2 size={20} /></div>
          <div className="metric-card__content">
            <span>OPEN SESSIONS</span>
            <strong>{openSessionsCount}</strong>
            <small>Ready for marking</small>
          </div>
        </article>
      </div>

      <section className="panel">
        <div className="panel__header">
          <h3>Quick Actions</h3>
        </div>
        <div className="quick-actions-bar">
          <button type="button" className="btn btn-primary" onClick={() => navigate('/teacher/sessions/create')}>
            <PlusCircle size={18} /> Create Attendance Session
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/teacher/sessions')}>
            <UserCheck size={18} /> Mark Attendance
          </button>
          <button type="button" className="btn btn-outline" onClick={() => navigate('/teacher/attendance/history')}>
            <BarChart3 size={18} /> View Attendance History
          </button>
          <button type="button" className="btn btn-outline" onClick={() => navigate('/teacher/classes')}>
            <BookOpen size={18} /> View My Classes
          </button>
        </div>
      </section>

      <div className="content-grid content-grid--two">
        <section className="panel">
          <div className="panel__header">
            <h3>Recent Attendance Sessions</h3>
          </div>
          {sessions.length === 0 ? (
            <div className="empty-state">
              <CalendarCheck2 size={36} className="muted" />
              <h4>No attendance sessions created yet</h4>
              <p>Click &quot;Create Attendance Session&quot; to start taking attendance for your class.</p>
            </div>
          ) : (
            <div className="session-list">
              {sessions.slice(0, 5).map((s) => (
                <div key={s.id} className="session-row">
                  <div>
                    <strong>{s.title || 'Class Session'}</strong>
                    <span>{s.date || 'Today'} • {s.startTime || '08:00 AM'} - {s.endTime || '09:00 AM'}</span>
                  </div>
                  <div className="session-actions">
                    <span className={`badge ${s.status === 'open' ? 'badge--success' : 'badge--secondary'}`}>
                      {(s.status || 'open').toUpperCase()}
                    </span>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline"
                      onClick={() => navigate(`/teacher/attendance?sessionId=${s.id}`)}
                    >
                      Mark
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="panel">
          <div className="panel__header">
            <h3>Assigned Classes Summary</h3>
          </div>
          {classes.length === 0 ? (
            <div className="empty-state">
              <BookOpen size={36} className="muted" />
              <h4>No classes assigned yet</h4>
              <p>Your class assignments will appear here once configured by school administration.</p>
            </div>
          ) : (
            <div className="session-list">
              {classes.map((c) => (
                <div key={c.id || c.classId} className="session-row">
                  <div>
                    <strong>{c.class?.name || c.className || 'Assigned Class'}</strong>
                    <span>Subject: {c.subject?.name || c.subjectName || 'General'}</span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary"
                    onClick={() => navigate('/teacher/classes')}
                  >
                    View Class
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default TeacherDashboard
