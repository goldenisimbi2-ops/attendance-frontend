import { useEffect, useState } from 'react'
import { BookOpen } from 'lucide-react'
import api, { getErrorMessage } from '../../app/api'
import Spinner from '../../component/ui/Spinner'

function HeadTeacherClasses() {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const res = await api.get('/classes').catch(() => ({ data: { data: [] } }))
        setClasses(res.data?.data || [])
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
        <h3>Loading school classes...</h3>
      </div>
    )
  }

  return (
    <div className="dashboard-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">Academic Supervision</p>
          <h2>Classes Overview</h2>
          <p className="muted">Monitor class statistics and attendance rates across all levels.</p>
        </div>
      </div>

      {error ? (
        <div className="error-state">
          <h3>Unable to load classes</h3>
          <p>{error}</p>
        </div>
      ) : classes.length === 0 ? (
        <div className="empty-state">
          <BookOpen size={48} className="muted" />
          <h3>No classes found</h3>
          <p>School classes will be displayed here once added.</p>
        </div>
      ) : (
        <div className="cards-grid">
          {classes.map((c) => (
            <div key={c.id} className="session-card">
              <div className="session-card__header">
                <strong>{c.name}</strong>
                <span className="badge badge--primary">{c.code || 'CLASS'}</span>
              </div>
              <div className="session-card__body">
                <p><strong>Attendance Rate:</strong> —</p>
                <p><strong>Capacity:</strong> {c.capacity ? `${c.capacity} Students` : '—'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default HeadTeacherClasses