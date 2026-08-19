import { useEffect, useState } from 'react'
import { ClipboardCheck } from 'lucide-react'
import api, { getErrorMessage } from '../../app/api'
import Spinner from '../../component/ui/Spinner'

function TeacherSubjects() {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const res = await api.get('/teachers/me/classes')
        setClasses(res.data?.data || [])
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="loading-card">
        <Spinner size="large" />
        <h3>Loading teacher subjects...</h3>
      </div>
    )
  }

  return (
    <div className="dashboard-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">Academic Curriculum</p>
          <h2>My Subjects</h2>
          <p className="muted">Subjects and course modules assigned to you.</p>
        </div>
      </div>

      {error ? (
        <div className="error-state">
          <h3>Unable to load subjects</h3>
          <p>{error}</p>
        </div>
      ) : classes.length === 0 ? (
        <div className="empty-state">
          <ClipboardCheck size={48} className="muted" />
          <h3>No assigned subjects found</h3>
          <p>Contact system administration for curriculum assignments.</p>
        </div>
      ) : (
        <div className="cards-grid">
          {classes.map((item) => (
            <div key={item.id} className="session-card">
              <div className="session-card__header">
                <strong>{item.subject?.name || item.subjectName || 'Subject'}</strong>
                <span className="badge badge--primary">Active</span>
              </div>
              <div className="session-card__body">
                <p><strong>Class:</strong> {item.class?.name || item.className || 'Assigned Class'}</p>
                <p><strong>Subject Code:</strong> {item.subject?.code || 'SUB-101'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TeacherSubjects