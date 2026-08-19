import { useEffect, useState } from 'react'
import { AlertCircle, Calendar, CheckCircle2, Clock3, Filter, XCircle } from 'lucide-react'
import api, { getErrorMessage } from '../../app/api'
import Spinner from '../../component/ui/Spinner'

function AttendanceMonitoring() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [filterDate, setFilterDate] = useState('')
  const [filterClass, setFilterClass] = useState('')
  const [filterTeacher, setFilterTeacher] = useState('')
  const [filterSubject, setFilterSubject] = useState('')
  const [filterStudent, setFilterStudent] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await api.get('/attendance').catch(() => api.get('/teachers/me/attendance'))
      setRecords(res.data?.data || res.data?.records || [])
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const filteredRecords = records.filter((rec) => {
    const recDate = rec.createdAt ? rec.createdAt.split('T')[0] : rec.date || ''
    const studentName = rec.studentName || (rec.student ? `${rec.student.firstName} ${rec.student.lastName}` : '')
    const teacherName = rec.teacherName || (rec.markedByUser ? `${rec.markedByUser.firstName} ${rec.markedByUser.lastName}` : '')
    const className = rec.className || rec.session?.classSubject?.class?.name || ''
    const subjectName = rec.subjectName || rec.session?.classSubject?.subject?.name || ''
    const status = (rec.status || '').toLowerCase()

    if (filterDate && recDate !== filterDate) return false
    if (filterClass && !className.toLowerCase().includes(filterClass.toLowerCase())) return false
    if (filterTeacher && !teacherName.toLowerCase().includes(filterTeacher.toLowerCase())) return false
    if (filterSubject && !subjectName.toLowerCase().includes(filterSubject.toLowerCase())) return false
    if (filterStudent && !studentName.toLowerCase().includes(filterStudent.toLowerCase())) return false
    if (filterStatus && status !== filterStatus.toLowerCase()) return false

    return true
  })

  const renderBadge = (status) => {
    const s = (status || '').toLowerCase()
    if (s === 'present') return <span className="badge badge--success"><CheckCircle2 size={13} /> Present</span>
    if (s === 'absent') return <span className="badge badge--danger"><XCircle size={13} /> Absent</span>
    if (s === 'late') return <span className="badge badge--warning"><Clock3 size={13} /> Late</span>
    if (s === 'excused') return <span className="badge badge--info"><AlertCircle size={13} /> Excused</span>
    return <span className="badge badge--secondary">Not Marked</span>
  }

  if (loading) {
    return (
      <div className="loading-card">
        <Spinner size="large" />
        <h3>Loading school-wide attendance monitoring...</h3>
      </div>
    )
  }

  return (
    <div className="dashboard-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">School Monitoring</p>
          <h2>Attendance Monitoring</h2>
          <p className="muted">Live monitoring of all attendance records across the institution.</p>
        </div>
      </div>

      {error ? (
        <div className="error-state">
          <AlertCircle size={32} className="text-danger" />
          <h3>Unable to load monitoring data</h3>
          <p>{error}</p>
          <button type="button" className="btn btn-primary" onClick={loadData}>
            Retry
          </button>
        </div>
      ) : (
        <section className="panel">
          <div className="panel__header">
            <div className="filter-bar">
              <div className="filter-item">
                <Filter size={16} />
                <strong>Filters:</strong>
              </div>
              <div className="filter-item">
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="input-field"
                />
              </div>
              <div className="filter-item">
                <input
                  type="text"
                  placeholder="Student..."
                  value={filterStudent}
                  onChange={(e) => setFilterStudent(e.target.value)}
                  className="input-field"
                />
              </div>
              <div className="filter-item">
                <input
                  type="text"
                  placeholder="Teacher..."
                  value={filterTeacher}
                  onChange={(e) => setFilterTeacher(e.target.value)}
                  className="input-field"
                />
              </div>
              <div className="filter-item">
                <input
                  type="text"
                  placeholder="Class..."
                  value={filterClass}
                  onChange={(e) => setFilterClass(e.target.value)}
                  className="input-field"
                />
              </div>
              <div className="filter-item">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="select-field"
                >
                  <option value="">All Statuses</option>
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late</option>
                  <option value="excused">Excused</option>
                </select>
              </div>
              {(filterDate || filterClass || filterTeacher || filterSubject || filterStudent || filterStatus) && (
                <button
                  type="button"
                  className="btn btn-outline small-btn"
                  onClick={() => {
                    setFilterDate('')
                    setFilterClass('')
                    setFilterTeacher('')
                    setFilterSubject('')
                    setFilterStudent('')
                    setFilterStatus('')
                  }}
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {filteredRecords.length === 0 ? (
            <div className="empty-state">
              <Calendar size={36} className="muted" />
              <h4>No attendance records found matching filters</h4>
              <p>Adjust your search criteria to view monitoring records.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Class</th>
                    <th>Teacher</th>
                    <th>Subject</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Check-in Time</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((r) => {
                    const stName = r.studentName || (r.student ? `${r.student.firstName} ${r.student.lastName}` : 'Student')
                    const tcName = r.teacherName || (r.markedByUser ? `${r.markedByUser.firstName} ${r.markedByUser.lastName}` : 'Teacher')
                    const clName = r.className || r.session?.classSubject?.class?.name || 'Class'
                    const sbName = r.subjectName || r.session?.classSubject?.subject?.name || 'Subject'

                    return (
                      <tr key={r.id}>
                        <td><strong>{stName}</strong></td>
                        <td>{clName}</td>
                        <td>{tcName}</td>
                        <td>{sbName}</td>
                        <td>{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'N/A'}</td>
                        <td>{renderBadge(r.status)}</td>
                        <td>{r.checkInTime ? new Date(r.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                        <td>{r.remarks || 'None'}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </div>
  )
}

export default AttendanceMonitoring