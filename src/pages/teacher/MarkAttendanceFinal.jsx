import { useEffect, useState } from 'react'
import api from '../../app/api'
import PageHeader from '../../component/PageHeader'
import DataTable from '../../component/DataTable'
import LoadingSkeleton from '../../component/LoadingSkeleton'
import ErrorState from '../../component/ErrorState'
import EmptyState from '../../component/EmptyState'
import StatusBadge from '../../component/StatusBadge'

function MarkAttendance() {
  const [students, setStudents] = useState([])
  const [attendance, setAttendance] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      // Fetch students for current class/session
      const { data } = await api.get('/users')
      const studentList = Array.isArray(data) ? data.filter((u) => u.role?.toLowerCase() === 'student') : []
      setStudents(studentList)
      const initialAttendance = {}
      studentList.forEach((s) => {
        initialAttendance[s.id] = 'present'
      })
      setAttendance(initialAttendance)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAttendanceChange = (studentId, status) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }))
  }

  const handleSave = async () => {
    try {
      const records = Object.entries(attendance).map(([studentId, status]) => ({ studentId, status }))
      await api.post('/attendance/bulk', { records })
      alert('Attendance saved successfully')
    } catch (err) {
      alert('Failed to save attendance: ' + err.message)
    }
  }

  if (loading) return <><PageHeader title="Mark Attendance" /><LoadingSkeleton rows={10} columns={4} /></>
  if (error) return <ErrorState message={error} retryAction={fetchData} />
  if (students.length === 0) return <><PageHeader title="Mark Attendance" /><EmptyState title="No students found" /></>

  const columns = [
    { key: 'name', label: 'Student', render: (r) => `${r.firstName || ''} ${r.lastName || ''}`.trim() },
    {
      key: 'attendance',
      label: 'Status',
      render: (r) => (
        <select value={attendance[r.id] || 'present'} onChange={(e) => handleAttendanceChange(r.id, e.target.value)} style={{ padding: '0.5rem', border: '1px solid var(--border)', borderRadius: '8px' }}>
          <option value="present">Present</option>
          <option value="absent">Absent</option>
          <option value="late">Late</option>
          <option value="excused">Excused</option>
        </select>
      ),
    },
  ]

  return (
    <>
      <PageHeader title="Mark Attendance" subtitle={`${students.length} students`} />
      <DataTable columns={columns} data={students} />
      <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
        <button onClick={handleSave} className="btn btn-primary">Save Attendance</button>
      </div>
    </>
  )
}

export default MarkAttendance
