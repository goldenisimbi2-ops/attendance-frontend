import { useEffect, useState } from 'react'
import api, { getErrorMessage } from '../../app/api'
import Spinner from '../../component/ui/Spinner'

function MyAttendance() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const { data } = await api.get('/students/me/attendance')
        setRecords(Array.isArray(data) ? data : data.records || [])
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  if (loading) return <div className="loading-card"><Spinner size="large" /><h3>Loading your attendance...</h3></div>
  if (error) return <div className="error-state"><h3>Unable to load attendance</h3><p>{error}</p></div>

  return (
    <div>
      <div className="page-header"><h2>My Attendance</h2></div>

      <div className="table-panel">
        {records.length === 0 ? (
          <div className="empty-state"><h3>No attendance records found.</h3></div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Subject</th>
                  <th>Class</th>
                  <th>Status</th>
                  <th>Check-in time</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id}>
                    <td>{record.date ? new Date(record.date).toLocaleDateString() : '—'}</td>
                    <td>{record.subjectName || '—'}</td>
                    <td>{record.className || '—'}</td>
                    <td><span className={`badge ${record.status === 'present' ? 'success' : record.status === 'late' ? 'warning' : 'default'}`}>{record.status || '—'}</span></td>
                    <td>{record.checkInTime || '—'}</td>
                    <td>{record.remarks || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyAttendance
