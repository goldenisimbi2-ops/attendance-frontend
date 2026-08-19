import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../app/api'
import PageHeader from '../../component/PageHeader'
import Button from '../../component/ui/Button'

function CreateAttendanceSession() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ title: '', classId: '', date: '', startTime: '', endTime: '' })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      await api.post('/attendance-sessions', form)
      navigate('/teacher/sessions')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PageHeader title="Create Attendance Session" subtitle="Start a new attendance session" />
      <div className="page-card" style={{ padding: '2rem', maxWidth: '600px' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Session Title *</label>
            <input type="text" name="title" value={form.title} onChange={handleChange} required style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '12px' }} />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Class *</label>
            <select name="classId" value={form.classId} onChange={handleChange} required style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '12px' }}>
              <option value="">Select a class</option>
            </select>
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Date *</label>
            <input type="date" name="date" value={form.date} onChange={handleChange} required style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '12px' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Start Time *</label>
              <input type="time" name="startTime" value={form.startTime} onChange={handleChange} required style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '12px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>End Time *</label>
              <input type="time" name="endTime" value={form.endTime} onChange={handleChange} required style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '12px' }} />
            </div>
          </div>
          {error && <div style={{ padding: '0.75rem', background: '#fee2e2', color: '#dc2626', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Creating...' : 'Create Session'}</Button>
            <Button type="button" variant="secondary" onClick={() => navigate(-1)}>Cancel</Button>
          </div>
        </form>
      </div>
    </>
  )
}

export default CreateAttendanceSession
