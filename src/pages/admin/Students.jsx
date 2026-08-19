import { useEffect, useState } from 'react'
import api, { getErrorMessage } from '../../app/api'
import Spinner from '../../component/ui/Spinner'

function Students() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const { data } = await api.get('/students')
        setStudents(Array.isArray(data) ? data : data.students || [])
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  if (loading) {
    return <div className="loading-card"><Spinner size="large" /><h3>Loading students...</h3></div>
  }

  if (error) {
    return <div className="error-state"><h3>Unable to load students</h3><p>{error}</p></div>
  }

  return (
    <div>
      <div className="page-header">
        <h2>Students</h2>
      </div>

      <div className="table-panel">
        {students.length === 0 ? (
          <div className="empty-state"><h3>No students found.</h3></div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Student Number</th>
                  <th>Email</th>
                  <th>Class</th>
                  <th>Phone</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td>{student.firstName} {student.lastName}</td>
                    <td>{student.studentNumber || '—'}</td>
                    <td>{student.email}</td>
                    <td>{student.className || student.class || '—'}</td>
                    <td>{student.phone || '—'}</td>
                    <td><span className={`badge ${student.status === 'inactive' ? 'warning' : 'success'}`}>{student.status || 'active'}</span></td>
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

export default Students
