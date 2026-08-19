import { useEffect, useState } from 'react'
import {
  BarChart3,
  BookOpen,
  CalendarCheck2,
  CheckCircle2,
  Clock3,
  FileX2,
  GraduationCap,
  Info,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../../app/api'
import StatusBadge from '../../component/StatusBadge'
import LoadingSkeleton from '../../component/LoadingSkeleton'
import ErrorState from '../../component/ErrorState'
import EmptyState from '../../component/EmptyState'

// Backend wraps responses as { success, data: ... }.
function unwrap(payload) {
  if (payload && typeof payload === 'object' && 'data' in payload) return payload.data ?? payload
  return payload
}

function isToday(value) {
  if (!value) return false
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return false
  const now = new Date()
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate()
}

function StudentDashboard() {
  const [student, setStudent] = useState(null)
  const [records, setRecords] = useState([])
  const [summary, setSummary] = useState({ present: 0, absent: 0, late: 0, excused: 0, attendancePercentage: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    try {
      setLoading(true)
      setError('')
      const [studentRes, recordsRes, summaryRes] = await Promise.all([
        api.get('/students/me'),
        api.get('/students/me/attendance'),
        api.get('/students/me/attendance/summary'),
      ])
      setStudent(unwrap(studentRes.data))
      const list = unwrap(recordsRes.data)
      setRecords(Array.isArray(list) ? list : [])
      setSummary(unwrap(summaryRes.data) || { present: 0, absent: 0, late: 0, excused: 0, attendancePercentage: 0 })
    } catch (err) {
      setError(err.message || 'Unable to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  if (loading) {
    return (
      <div className="dashboard-shell">
        <LoadingSkeleton rows={2} columns={5} type="cards" />
        <LoadingSkeleton rows={4} columns={4} />
      </div>
    )
  }

  if (error) {
    return <ErrorState message={error} retryAction={load} />
  }

  const studentName = `${student?.firstName || 'Student'} ${student?.lastName || ''}`.trim()
  const attendanceRate = Math.round(summary.attendancePercentage || 0)
  const todaysRecords = records.filter((record) => isToday(record.checkInTime)).slice(0, 8)
  const recentRecords = records.slice(0, 5)

  const timeString = (value) =>
    value ? new Date(value).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) : '—'
  const dateString = (value) => (value ? new Date(value).toLocaleDateString() : '—')

  return (
    <div className="dashboard-shell">
      <div className="welcome-hero">
        <div>
          <p className="welcome-hero__eyebrow">Student portal</p>
          <h1>Welcome back, {studentName}</h1>
          <p>Here&apos;s your attendance overview.</p>
        </div>
        <div className="welcome-hero__actions">
          <Link to="/student/attendance/history" className="btn btn-primary">View Attendance History</Link>
          <Link to="/student/attendance/summary" className="btn btn-secondary">Attendance Summary</Link>
        </div>
      </div>

      <div className="stats-grid stats-grid--auto">
        <div className="stat-card"><div className="stat-card__label">Attendance Rate</div><div className="stat-card__value">{attendanceRate}%</div></div>
        <div className="stat-card"><div className="stat-card__label"><CheckCircle2 size={14} /> Present</div><div className="stat-card__value">{summary.present || 0}</div></div>
        <div className="stat-card"><div className="stat-card__label"><FileX2 size={14} /> Absent</div><div className="stat-card__value">{summary.absent || 0}</div></div>
        <div className="stat-card"><div className="stat-card__label"><Clock3 size={14} /> Late</div><div className="stat-card__value">{summary.late || 0}</div></div>
        <div className="stat-card"><div className="stat-card__label"><CalendarCheck2 size={14} /> Excused</div><div className="stat-card__value">{summary.excused || 0}</div></div>
      </div>

      <div className="content-grid content-grid--two">
        <section className="panel">
          <div className="panel__header">
            <h3>Today&apos;s Attendance</h3>
            <span className="pill pill--info">{todaysRecords.length} record{todaysRecords.length === 1 ? '' : 's'}</span>
          </div>
          {todaysRecords.length === 0 ? (
            <EmptyState
              icon={CalendarCheck2}
              title="No attendance records today"
              message="Your teacher has not marked your attendance today yet, or you have no sessions scheduled."
            />
          ) : (
            <div className="session-list">
              {todaysRecords.map((record) => (
                <div className="session-row" key={record.id}>
                  <div>
                    <strong>Attendance record</strong>
                    <span>{timeString(record.checkInTime)}{record.remarks ? ` • ${record.remarks}` : ''}</span>
                  </div>
                  <StatusBadge status={record.status} />
                </div>
              ))}
            </div>
          )}
          <div className="inline-note">
            <Info size={15} />
            <span>
              Subject, teacher, and class details per session are not returned by the current backend API; only the marked
              status and check-in time are available.
            </span>
          </div>
        </section>

        <section className="panel">
          <div className="panel__header">
            <h3>Recent attendance</h3>
            <Link to="/student/attendance/history" className="link-row">See all</Link>
          </div>
          {recentRecords.length === 0 ? (
            <EmptyState icon={CalendarCheck2} title="No attendance yet" message="No attendance records have been marked for you." />
          ) : (
            <div className="session-list">
              {recentRecords.map((record) => (
                <div className="session-row" key={record.id}>
                  <div>
                    <strong>{dateString(record.checkInTime)}</strong>
                    <span>Checked in at {timeString(record.checkInTime)}</span>
                  </div>
                  <StatusBadge status={record.status} />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="panel">
        <div className="panel__header">
          <h3>Class &amp; profile</h3>
        </div>
        <div className="profile-grid">
          <div className="profile-item"><span>Class</span><strong>{student?.studentProfile?.classId || '—'}</strong></div>
          <div className="profile-item"><span>Student Number</span><strong>{student?.studentProfile?.studentNumber || '—'}</strong></div>
          <div className="profile-item"><span>Email</span><strong>{student?.email || '—'}</strong></div>
          <div className="profile-item"><span>Role</span><strong>{(student?.role || 'student').toUpperCase()}</strong></div>
        </div>
        <div className="form-actions" style={{ marginTop: '1rem' }}>
          <Link to="/student/profile" className="btn btn-secondary btn-sm"><GraduationCap size={15} /> View full profile</Link>
          <Link to="/student/classes" className="btn btn-ghost btn-sm"><BookOpen size={15} /> My Classes</Link>
        </div>
      </section>
    </div>
  )
}

export default StudentDashboard
