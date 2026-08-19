import { useEffect, useState } from 'react'
import { GraduationCap } from 'lucide-react'
import api, { getErrorMessage } from '../../app/api'
import Spinner from '../../component/ui/Spinner'

function StudentClasses() {
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const res = await api.get('/students/me')
        setStudent(res.data?.data || res.data?.user || res.data)
      } catch (err) {
        setError(getErrorMessage(err))
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
        <h3>Loading class details...</h3>
      </div>
    )
  }

  const studentProfile = student?.studentProfile || {}

  return (
    <div className="dashboard-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">Academic Enrollment</p>
          <h2>My Classes & Subjects</h2>
          <p className="muted">Overview of your assigned class and active subjects.</p>
        </div>
      </div>

      {error ? (
        <div className="error-state">
          <h3>Unable to load class data</h3>
          <p>{error}</p>
        </div>
      ) : (
        <div className="content-grid content-grid--two">
          <section className="panel">
            <div className="panel__header">
              <h3>Current Class</h3>
            </div>
            <div className="card-detail">
              <div className="card-detail__icon"><GraduationCap size={28} /></div>
              <div>
                <h4>{studentProfile.class?.name || student?.className || 'Assigned Class'}</h4>
                <p className="muted">Class Code: {studentProfile.class?.code || 'N/A'}</p>
                <p className="muted">Student Number: {studentProfile.studentNumber || 'N/A'}</p>
              </div>
            </div>
          </section>

          <section className="panel">
            <div className="panel__header">
              <h3>Active Subjects</h3>
            </div>
            <div className="session-list">
              <div className="empty-state">
                <GraduationCap size={36} className="muted" />
                <h4>Subjects not available yet</h4>
                <p>
                  The backend does not expose the list of subjects for a student. This section will populate once the
                  API returns the class's subjects (e.g. via /api/students/me/subjects).
                </p>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

export default StudentClasses