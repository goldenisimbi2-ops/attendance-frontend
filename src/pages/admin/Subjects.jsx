import { useEffect, useState } from 'react'
import api, { getErrorMessage } from '../../app/api'
import Button from '../../component/ui/Button'
import Spinner from '../../component/ui/Spinner'

function Subjects() {
  const [subjects, setSubjects] = useState([])
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', code: '', description: '', classId: '' })
  const [editingId, setEditingId] = useState(null)

  const loadData = async () => {
    try {
      setLoading(true)
      const [subjectsRes, classesRes] = await Promise.all([
        api.get('/subjects'),
        api.get('/classes')
      ])
      setSubjects(Array.isArray(subjectsRes.data) ? subjectsRes.data : subjectsRes.data.data || [])
      setClasses(Array.isArray(classesRes.data) ? classesRes.data : classesRes.data.data || [])
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      if (editingId) {
        await api.put(`/subjects/${editingId}`, form)
      } else {
        await api.post('/subjects', form)
      }

      setForm({ name: '', code: '', description: '', classId: '' })
      setEditingId(null)
      loadData()
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  const handleEdit = (subject) => {
    setEditingId(subject.id)
    setForm({ name: subject.name || '', code: subject.code || '', description: subject.description || '', classId: subject.classId || '' })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this subject?')) return

    try {
      await api.delete(`/subjects/${id}`)
      loadData()
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  return (
    <div>
      <div className="page-header">
        <h2>Subjects</h2>
      </div>

      <div className="page-card" style={{ marginBottom: '1.25rem' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="field"><label>Name</label><input name="name" value={form.name} onChange={handleChange} /></div>
            <div className="field"><label>Code</label><input name="code" value={form.code} onChange={handleChange} /></div>
            <div className="field">
              <label>Class (Optional)</label>
              <select name="classId" value={form.classId} onChange={handleChange}>
                <option value="">Select Class</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="field" style={{ gridColumn: '1 / -1' }}><label>Description</label><textarea name="description" value={form.description} onChange={handleChange} rows={3} /></div>
          </div>
          <div className="form-actions" style={{ marginTop: '1rem' }}>
            <Button type="submit">{editingId ? 'Save changes' : 'Create subject'}</Button>
            {editingId ? <Button type="button" variant="secondary" onClick={() => { setEditingId(null); setForm({ name: '', code: '', description: '', classId: '' }) }}>Cancel</Button> : null}
          </div>
        </form>
      </div>

      {loading ? (
        <div className="loading-card"><Spinner size="large" /><h3>Loading subjects...</h3></div>
      ) : error ? (
        <div className="error-state"><h3>Unable to load subjects</h3><p>{error}</p></div>
      ) : subjects.length === 0 ? (
        <div className="empty-state"><h3>No subjects found.</h3></div>
      ) : (
        <div className="table-panel">
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Code</th>
                  <th>Class</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subject) => (
                  <tr key={subject.id}>
                    <td>{subject.name}</td>
                    <td>{subject.code}</td>
                    <td>{subject.class ? subject.class.name : '—'}</td>
                    <td>{subject.description || '—'}</td>
                    <td>
                      <div className="page-actions">
                        <Button variant="secondary" onClick={() => handleEdit(subject)}>Edit</Button>
                        <Button variant="danger" onClick={() => handleDelete(subject.id)}>Delete</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default Subjects
