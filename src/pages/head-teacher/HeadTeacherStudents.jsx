import { useEffect, useState } from 'react'
import { GraduationCap, Search } from 'lucide-react'
import api from '../../app/api'
import Spinner from '../../component/ui/Spinner'

function HeadTeacherStudents() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const res = await api.get('/users').catch(() => ({ data: { data: [] } }))
        const rows = res.data?.data || []
        const studentList = rows.filter((u) => u.role === 'student')
        setStudents(studentList)
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
        <h3>Loading student monitoring roster...</h3>
      </div>
    )
  }

  const filtered = students.filter((s) => {
    const full = `${s.firstName} ${s.lastName || ''}`.toLowerCase()
    return full.includes(searchTerm.toLowerCase()) || (s.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  })

  return (
    <div className="dashboard-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">Student Monitoring</p>
          <h2>Student Attendance Roster</h2>
          <p className="muted">Identify low-attendance students requiring academic intervention.</p>
        </div>
      </div>

      <section className="panel">
        <div className="panel__header">
          <div className="search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search student by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <GraduationCap size={36} className="muted" />
            <h4>No students found</h4>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Attendance Rate</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id}>
                    <td><strong>{s.firstName} {s.lastName}</strong></td>
                    <td>{s.email}</td>
                    <td><span className="badge badge--success">Enrolled</span></td>
                    <td><strong>—</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

export default HeadTeacherStudents