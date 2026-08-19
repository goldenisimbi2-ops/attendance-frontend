import { useEffect, useState } from 'react'
import api from '../../app/api'
import Spinner from '../../component/ui/Spinner'

function HeadTeacherTeachers() {
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const res = await api.get('/users').catch(() => ({ data: { data: [] } }))
        const rows = res.data?.data || []
        const teacherList = rows.filter((u) => u.role === 'teacher')
        setTeachers(teacherList)
      } catch {
        // Fallback
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="loading-card">
        <Spinner size="large" />
        <h3>Loading faculty monitoring...</h3>
      </div>
    )
  }

  return (
    <div className="dashboard-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">Faculty Monitoring</p>
          <h2>Teacher Activity Overview</h2>
          <p className="muted">Track attendance marking completion and active teaching sessions.</p>
        </div>
      </div>

      <section className="panel">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Teacher Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((t) => (
                <tr key={t.id}>
                  <td><strong>{t.firstName} {t.lastName}</strong></td>
                  <td>{t.email}</td>
                  <td>{t.phone || '—'}</td>
                  <td><span className="badge badge--success">Active</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default HeadTeacherTeachers