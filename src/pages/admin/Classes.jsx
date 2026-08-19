import { useEffect, useState } from 'react'
import api, { getErrorMessage } from '../../app/api'
import Button from '../../component/ui/Button'
import Spinner from '../../component/ui/Spinner'

function Classes() {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', code: '', description: '' })
  const [editingId, setEditingId] = useState(null)

  const loadClasses = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/classes')
      setClasses(Array.isArray(data) ? data : data.classes || [])
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadClasses() }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      if (editingId) {
        await api.put(`/classes/${editingId}`, form)
      } else {
        await api.post('/classes', form)
      }

      setForm({ name: '', code: '', description: '' })
      setEditingId(null)
      loadClasses()
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  const handleEdit = (item) => {
    setEditingId(item.id)
    setForm({ name: item.name || '', code: item.code || '', description: item.description || '' })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this class?')) return

    try {
      await api.delete(`/classes/${id}`)
      loadClasses()
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  return (
    <div>
      <div className="page-header">
        <h2>Classes</h2>
      </div>

      <div className="page-card" style={{ marginBottom: '1.25rem' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="field"><label>Name</label><input name="name" value={form.name} onChange={handleChange} /></div>
            <div className="field"><label>Code</label><input name="code" value={form.code} onChange={handleChange} /></div>
            <div className="field" style={{ gridColumn: '1 / -1' }}><label>Description</label><textarea name="description" value={form.description} onChange={handleChange} rows={3} /></div>
          </div>
          <div className="form-actions" style={{ marginTop: '1rem' }}>
            <Button type="submit">{editingId ? 'Save changes' : 'Create class'}</Button>
            {editingId ? <Button type="button" variant="secondary" onClick={() => { setEditingId(null); setForm({ name: '', code: '', description: '' }) }}>Cancel</Button> : null}
          </div>
        </form>
      </div>

      {loading ? (
        <div className="loading-card"><Spinner size="large" /><h3>Loading classes...</h3></div>
      ) : error ? (
        <div className="error-state"><h3>Unable to load classes</h3><p>{error}</p></div>
      ) : classes.length === 0 ? (
        <div className="empty-state"><h3>No classes found.</h3></div>
      ) : (
        <div className="table-panel">
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Code</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.code}</td>
                    <td>{item.description || '—'}</td>
                    <td>
                      <div className="page-actions">
                        <Button variant="secondary" onClick={() => handleEdit(item)}>Edit</Button>
                        <Button variant="danger" onClick={() => handleDelete(item.id)}>Delete</Button>
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

export default Classes
