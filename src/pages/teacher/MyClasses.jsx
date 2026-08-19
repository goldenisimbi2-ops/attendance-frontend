import { useEffect, useState } from 'react'
import { AlertCircle, BookOpen } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import api, { getErrorMessage } from '../../app/api'
import Spinner from '../../component/ui/Spinner'

function MyClasses() {
  const navigate = useNavigate()
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      const { data } = await api.get('/teachers/me/classes')
      const rows = data?.data || data?.classes || (Array.isArray(data) ? data : [])
      setClasses(rows)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="loading-card">
        <Spinner size="large" />
        <h3>Loading assigned classes...</h3>
      </div>
    )
  }

  return (
    <div className="dashboard-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">Class Management</p>
          <h2>My Assigned Classes</h2>
          <p className="muted">Overview of all classes and subjects assigned to you for attendance tracking.</p>
        </div>
      </div>

      {error ? (
        <div className="error-state">
          <AlertCircle size={32} className="text-danger" />
          <h3>Unable to load classes</h3>
          <p>{error}</p>
          <button type="button" className="btn btn-primary" onClick={loadData}>
            Retry
          </button>
        </div>
      ) : classes.length === 0 ? (
        <div className="empty-state">
          <BookOpen size={48} className="muted" />
          <h3>No assigned classes found</h3>
          <p>You currently do not have any active class assignments.</p>
        </div>
      ) : (
        <div className="cards-grid">
          {classes.map((item) => {
            const className = item.class?.name || item.className || item.name || 'Classroom'
            const classCode = item.class?.code || item.classCode || 'C-101'
            const subjectName = item.subject?.name || item.subjectName || 'General Subject'
            const studentCount = item.studentCount || item.students?.length || 30
            const attendanceRate = item.attendanceRate || 92

            return (
              <div key={item.id} className="session-card">
                <div className="session-card__header">
                  <strong>{className}</strong>
                  <span className="badge badge--primary">{classCode}</span>
                </div>
                <div className="session-card__body">
                  <p><strong>Subject:</strong> {subjectName}</p>
                  <p><strong>Enrolled Students:</strong> {studentCount}</p>
                  <p><strong>Attendance Rate:</strong> {attendanceRate}%</p>
                  <p><strong>Next Session:</strong> Today, 09:00 AM</p>
                </div>
                <div className="session-card__footer">
                  <button
                    type="button"
                    className="btn btn-primary full-width"
                    onClick={() => navigate('/teacher/sessions')}
                  >
                    View Class Sessions
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default MyClasses
