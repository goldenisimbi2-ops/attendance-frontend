import { useEffect, useState } from 'react'
import api, { getErrorMessage } from '../../app/api'
import Spinner from '../../component/ui/Spinner'

function Attendance() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const { data } = await api.get('/attendance')
        setRecords(Array.isArray(data) ? data : data.data || [])
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  if (loading) {
    return <div className="loading-card"><Spinner size="large" /><h3>Loading attendance...</h3></div>
  }

  if (error) {
    return <div className="error-state"><h3>Unable to load attendance records.</h3><p>{error}</p></div>
  }

  return (
    <div>
      <div className="page-header">
        <h2>Attendance</h2>
      </div>

      <div className="table-panel">
        {records.length === 0 ? (
          <div className="empty-state"><h3>No attendance records found.</h3></div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Class</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id}>
                    <td>{record.studentName || '—'}</td>
                    <td>{record.className || '—'}</td>
                    <td>{record.subjectName || '—'}</td>
                    <td><span className={`badge ${record.status === 'present' ? 'success' : record.status === 'late' ? 'warning' : 'default'}`}>{record.status || '—'}</span></td>
                    <td>{record.createdAt ? new Date(record.createdAt).toLocaleDateString() : '—'}</td>
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

export default Attendance
