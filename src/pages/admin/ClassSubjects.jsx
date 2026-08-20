import { useEffect, useState } from 'react'
import api, { getErrorMessage } from '../../app/api'
import Button from '../../component/ui/Button'
import Spinner from '../../component/ui/Spinner'

function ClassSubjects() {
  const [assignments, setAssignments] = useState([])
  const [classes, setClasses] = useState([])
  const [subjects, setSubjects] = useState([])
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ classId: '', subjectId: '', teacherId: '' })

  const loadData = async () => {
    try {
      setLoading(true)
      const [classRes, subjectRes, teacherRes, assignmentRes] = await Promise.all([
        api.get('/classes'),
        api.get('/subjects'),
        api.get('/teachers'),
        api.get('/class-subjects'),
      ])

      setClasses(Array.isArray(classRes.data) ? classRes.data : classRes.data.data || [])
      setSubjects(Array.isArray(subjectRes.data) ? subjectRes.data : subjectRes.data.data || [])
      setTeachers(Array.isArray(teacherRes.data) ? teacherRes.data : teacherRes.data.data || [])
      setAssignments(Array.isArray(assignmentRes.data) ? assignmentRes.data : assignmentRes.data.data || [])
    } catch (err) {
      setLoading(false)
      console.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await api.post('/class-subjects', form)
      setForm({ classId: '', subjectId: '', teacherId: '' })
      loadData()
    } catch (err) {
      console.error(getErrorMessage(err))
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this assignment?')) return
    try {
      await api.delete(`/class-subjects/${id}`)
      loadData()
    } catch (err) {
      console.error(getErrorMessage(err))
    }
  }

  return (
    <div>
      <div className="page-header">
        <h2>Class Subjects</h2>
      </div>

      <div className="page-card" style={{ marginBottom: '1.25rem' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="field">
              <label>Class</label>
              <select value={form.classId} onChange={(e) => setForm({ ...form, classId: e.target.value })}>
                <option value="">Select class</option>
                {classes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
            </div>

            <div className="field">
              <label>Subject</label>
              <select value={form.subjectId} onChange={(e) => setForm({ ...form, subjectId: e.target.value })} disabled={!form.classId}>
                <option value="">Select subject</option>
                {subjects
                  .filter(item => !item.classId || item.classId === form.classId)
                  .map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
            </div>

            <div className="field">
              <label>Teacher</label>
              <select value={form.teacherId} onChange={(e) => setForm({ ...form, teacherId: e.target.value })}>
                <option value="">Select teacher</option>
                {teachers.map((item) => <option key={item.id} value={item.id}>{item.firstName} {item.lastName}</option>)}
              </select>
            </div>
          </div>

          <div className="form-actions" style={{ marginTop: '1rem' }}>
            <Button type="submit">Assign subject</Button>
          </div>
        </form>
      </div>

      {loading ? (
        <div className="loading-card"><Spinner size="large" /><h3>Loading assignments...</h3></div>
      ) : assignments.length === 0 ? (
        <div className="empty-state"><h3>No class subjects assigned.</h3></div>
      ) : (
        <div className="table-panel">
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Class</th>
                  <th>Subject</th>
                  <th>Teacher</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((item) => (
                  <tr key={item.id}>
                    <td>{item.className || item.class?.name || '—'}</td>
                    <td>{item.subjectName || item.subject?.name || '—'}</td>
                    <td>{item.teacherName || item.teacher?.firstName || '—'}</td>
                    <td>
                      <Button variant="danger" onClick={() => handleDelete(item.id)}>Delete</Button>
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

export default ClassSubjects
