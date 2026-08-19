import { useEffect, useState } from 'react'
import { AlertCircle, CheckCircle2, PlusCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import api, { getErrorMessage } from '../../app/api'
import Button from '../../component/ui/Button'
import Spinner from '../../component/ui/Spinner'

function CreateAttendanceSession() {
  const navigate = useNavigate()
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [form, setForm] = useState({
    classSubjectId: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '08:00',
    endTime: '09:30',
    title: '',
    description: '',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        // Try teacher classes first
        const res = await api.get('/teachers/me/classes').catch(() => null)
        let rows = res?.data?.data || res?.data?.classes || (Array.isArray(res?.data) ? res.data : [])

        if (!rows || rows.length === 0) {
          const fallback = await api.get('/class-subjects').catch(() => null)
          rows = fallback?.data?.data || fallback?.data?.assignments || (Array.isArray(fallback?.data) ? fallback.data : [])
        }

        setClasses(rows)
        if (rows.length > 0) {
          setForm((prev) => ({ ...prev, classSubjectId: rows[0].id || rows[0].classSubjectId || '' }))
        }
      } catch (err) {
        console.error(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const validate = () => {
    const nextErrors = {}
    if (!form.classSubjectId) nextErrors.classSubjectId = 'Class/Subject selection is required'
    if (!form.date) nextErrors.date = 'Date is required'
    if (!form.startTime) nextErrors.startTime = 'Start time is required'
    if (!form.endTime) nextErrors.endTime = 'End time is required'
    if (form.startTime && form.endTime && form.startTime >= form.endTime) {
      nextErrors.endTime = 'End time must be after start time'
    }
    return nextErrors
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSuccessMsg('')
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    try {
      setSaving(true)
      const payload = {
        classSubjectId: form.classSubjectId,
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        title: form.title || 'Attendance Session',
        description: form.description || '',
      }
      const { data } = await api.post('/attendance-sessions', payload)
      setSuccessMsg('Attendance session created successfully.')
      setTimeout(() => {
        const createdId = data.data?.id || data.id || data.sessionId
        navigate(`/teacher/attendance?sessionId=${createdId}`)
      }, 1200)
    } catch (err) {
      setErrors({ form: getErrorMessage(err) })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="dashboard-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">Session Management</p>
          <h2>Create Attendance Session</h2>
          <p className="muted">Set up a new attendance session for your students.</p>
        </div>
      </div>

      <div className="page-card">
        {loading ? (
          <div className="loading-card">
            <Spinner size="large" />
            <h3>Loading class options...</h3>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            {successMsg ? (
              <div className="message-box message-box--success" style={{ marginBottom: '1.5rem' }}>
                <CheckCircle2 size={18} /> {successMsg}
              </div>
            ) : null}

            <div className="form-grid">
              <div className="field">
                <label htmlFor="classSubjectId">Class & Subject</label>
                <select id="classSubjectId" name="classSubjectId" value={form.classSubjectId} onChange={handleChange}>
                  <option value="">Select class subject</option>
                  {classes.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.class?.name || item.className || item.name || 'Class'} - {item.subject?.name || item.subjectName || item.subject || 'Subject'}
                    </option>
                  ))}
                </select>
                {errors.classSubjectId ? <small className="field-error">{errors.classSubjectId}</small> : null}
              </div>

              <div className="field">
                <label htmlFor="date">Session Date</label>
                <input id="date" type="date" name="date" value={form.date} onChange={handleChange} />
                {errors.date ? <small className="field-error">{errors.date}</small> : null}
              </div>

              <div className="field">
                <label htmlFor="startTime">Start Time</label>
                <input id="startTime" type="time" name="startTime" value={form.startTime} onChange={handleChange} />
                {errors.startTime ? <small className="field-error">{errors.startTime}</small> : null}
              </div>

              <div className="field">
                <label htmlFor="endTime">End Time</label>
                <input id="endTime" type="time" name="endTime" value={form.endTime} onChange={handleChange} />
                {errors.endTime ? <small className="field-error">{errors.endTime}</small> : null}
              </div>

              <div className="field" style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="title">Session Title</label>
                <input id="title" name="title" value={form.title} onChange={handleChange} placeholder="e.g. Mathematics Morning Lecture" />
              </div>

              <div className="field" style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="description">Description / Notes</label>
                <textarea id="description" name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Optional session notes or instructions" />
              </div>
            </div>

            {errors.form ? (
              <div className="message-box message-box--danger" style={{ marginTop: '1rem' }}>
                <AlertCircle size={18} /> {errors.form}
              </div>
            ) : null}

            <div className="form-actions" style={{ marginTop: '1.5rem' }}>
              <Button type="submit" disabled={saving}>
                <PlusCircle size={16} />
                {saving ? 'Creating Session...' : 'Create Session'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default CreateAttendanceSession
