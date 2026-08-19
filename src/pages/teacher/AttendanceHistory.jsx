import { useEffect, useState } from 'react'
import { AlertCircle, Calendar, CheckCircle2, Clock3, Filter, User, XCircle } from 'lucide-react'
import api, { getErrorMessage } from '../../app/api'
import Spinner from '../../component/ui/Spinner'

function TeacherAttendanceHistory() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [filterDate, setFilterDate] = useState('')
  const [filterClass, setFilterClass] = useState('')
  const [filterSubject, setFilterSubject] = useState('')
  const [filterStudent, setFilterStudent] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  const [selectedStudent, setSelectedStudent] = useState(null)

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await api.get('/teachers/me/attendance').catch(() => api.get('/attendance'))
      const rows = res.data?.data || res.data?.records || (Array.isArray(res.data) ? res.data : [])
      setRecords(rows)
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
    const className = rec.className || rec.session?.classSubject?.class?.name || ''
    const subjectName = rec.subjectName || rec.session?.classSubject?.subject?.name || ''
    const status = (rec.status || '').toLowerCase()

    if (filterDate && recDate !== filterDate) return false
    if (filterClass && !className.toLowerCase().includes(filterClass.toLowerCase())) return false
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
        <h3>Loading teacher attendance history...</h3>
      </div>
    )
  }

  return (
    <div className="dashboard-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">Class Records</p>
          <h2>Teacher Attendance History</h2>
          <p className="muted">Review and filter all attendance records marked by you.</p>
        </div>
      </div>

      {error ? (
        <div className="error-state">
          <AlertCircle size={32} className="text-danger" />
          <h3>Unable to load history</h3>
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
                  placeholder="Student name..."
                  value={filterStudent}
                  onChange={(e) => setFilterStudent(e.target.value)}
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
              {(filterDate || filterClass || filterSubject || filterStudent || filterStatus) && (
                <button
                  type="button"
                  className="btn btn-outline small-btn"
                  onClick={() => {
                    setFilterDate('')
                    setFilterClass('')
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
              <p>Try resetting filters to view all historical records.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Class</th>
                    <th>Subject</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Remarks</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((r) => {
                    const stName = r.studentName || (r.student ? `${r.student.firstName} ${r.student.lastName}` : 'Student')
                    const clName = r.className || r.session?.classSubject?.class?.name || 'Class'
                    const sbName = r.subjectName || r.session?.classSubject?.subject?.name || 'Subject'

                    return (
                      <tr key={r.id}>
                        <td><strong>{stName}</strong></td>
                        <td>{clName}</td>
                        <td>{sbName}</td>
                        <td>{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'N/A'}</td>
                        <td>{renderBadge(r.status)}</td>
                        <td>{r.remarks || 'None'}</td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline"
                            onClick={() =>
                              setSelectedStudent({
                                name: stName,
                                className: clName,
                                subject: sbName,
                                status: r.status,
                                remarks: r.remarks,
                              })
                            }
                          >
                            <User size={14} /> Profile
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {selectedStudent && (
        <div className="modal-backdrop" onClick={() => setSelectedStudent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Student Attendance Profile</h3>
              <button type="button" className="close-btn" onClick={() => setSelectedStudent(null)}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <p><strong>Name:</strong> {selectedStudent.name}</p>
              <p><strong>Class:</strong> {selectedStudent.className}</p>
              <p><strong>Subject:</strong> {selectedStudent.subject}</p>
              <p><strong>Latest Status:</strong> {renderBadge(selectedStudent.status)}</p>
              <p><strong>Remarks:</strong> {selectedStudent.remarks || 'None'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TeacherAttendanceHistory
