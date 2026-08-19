import { useEffect, useState } from 'react'
import api, { getErrorMessage } from '../../app/api'
import Spinner from '../../component/ui/Spinner'

function Teachers() {
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const { data } = await api.get('/teachers')
        setTeachers(Array.isArray(data) ? data : data.teachers || [])
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  if (loading) {
    return <div className="loading-card"><Spinner size="large" /><h3>Loading teachers...</h3></div>
  }

  if (error) {
    return <div className="error-state"><h3>Unable to load teachers</h3><p>{error}</p></div>
  }

  return (
    <div>
      <div className="page-header">
        <h2>Teachers</h2>
      </div>

      <div className="table-panel">
        {teachers.length === 0 ? (
          <div className="empty-state"><h3>No teachers found.</h3></div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Employee Number</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((teacher) => (
                  <tr key={teacher.id}>
                    <td>{teacher.firstName} {teacher.lastName}</td>
                    <td>{teacher.employeeNumber || '—'}</td>
                    <td>{teacher.email}</td>
                    <td>{teacher.phone || '—'}</td>
                    <td><span className={`badge ${teacher.status === 'inactive' ? 'warning' : 'success'}`}>{teacher.status || 'active'}</span></td>
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

export default Teachers
