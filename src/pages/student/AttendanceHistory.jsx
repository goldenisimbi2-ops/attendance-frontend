import { useEffect, useState } from 'react'
import { AlertCircle, Calendar, CheckCircle2, Clock3, Filter, XCircle } from 'lucide-react'
import api, { getErrorMessage } from '../../app/api'
import Spinner from '../../component/ui/Spinner'

function StudentAttendanceHistory() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [filterDate, setFilterDate] = useState('')
  const [filterSubject, setFilterSubject] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await api.get('/students/me/attendance')
      setRecords(res.data?.data || [])
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
    const recDate = rec.createdAt ? rec.createdAt.split('T')[0] : ''
    const subjectName = rec.session?.classSubject?.subject?.name || ''
    const status = (rec.status || '').toLowerCase()

    if (filterDate && recDate !== filterDate) return false
    if (filterSubject && !subjectName.toLowerCase().includes(filterSubject.toLowerCase())) return false
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
        <h3>Loading attendance history...</h3>
      </div>
    )
  }

  return (
    <div className="dashboard-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">Student Records</p>
          <h2>My Attendance</h2>
          <p className="muted">View your complete attendance history and session details.</p>
        </div>
      </div>

      {error ? (
        <div className="error-state">
          <AlertCircle size={32} className="text-danger" />
          <h3>Unable to load attendance records</h3>
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
                <label htmlFor="filter-date" className="sr-only">Date</label>
                <input
                  id="filter-date"
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="input-field"
                />
              </div>
              <div className="filter-item">
                <label htmlFor="filter-subject" className="sr-only">Subject</label>
                <input
                  id="filter-subject"
                  type="text"
                  placeholder="Filter by subject..."
                  value={filterSubject}
                  onChange={(e) => setFilterSubject(e.target.value)}
                  className="input-field"
                />
              </div>
              <div className="filter-item">
                <label htmlFor="filter-status" className="sr-only">Status</label>
                <select
                  id="filter-status"
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
              {(filterDate || filterSubject || filterStatus) && (
                <button
                  type="button"
                  className="btn btn-outline small-btn"
                  onClick={() => {
                    setFilterDate('')
                    setFilterSubject('')
                    setFilterStatus('')
                  }}
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>

          {filteredRecords.length === 0 ? (
            <div className="empty-state">
              <Calendar size={36} className="muted" />
              <h4>No attendance records found</h4>
              <p>Try adjusting your search filters or check back after your next class session.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Subject</th>
                    <th>Teacher</th>
                    <th>Class</th>
                    <th>Status</th>
                    <th>Check-in Time</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((r) => (
                    <tr key={r.id}>
                      <td>{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'N/A'}</td>
                      <td><strong>{r.session?.classSubject?.subject?.name || r.session?.title || 'Subject'}</strong></td>
                      <td>{r.session?.classSubject?.teacher?.firstName ? `${r.session.classSubject.teacher.firstName} ${r.session.classSubject.teacher.lastName}` : 'Teacher'}</td>
                      <td>{r.session?.classSubject?.class?.name || 'Class'}</td>
                      <td>{renderBadge(r.status)}</td>
                      <td>{r.checkInTime ? new Date(r.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                      <td>{r.remarks || 'None'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </div>
  )
}

export default StudentAttendanceHistory