import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import api from '../../app/api'
import PageHeader from '../../component/PageHeader'
import DataTable from '../../component/DataTable'
import LoadingSkeleton from '../../component/LoadingSkeleton'
import ErrorState from '../../component/ErrorState'
import EmptyState from '../../component/EmptyState'
import StatusBadge from '../../component/StatusBadge'

function MyAttendance() {
  const [records, setRecords] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    fetchAttendance()
  }, [])

  useEffect(() => {
    let result = records
    if (statusFilter) result = result.filter((r) => r.status === statusFilter)
    setFiltered(result)
  }, [records, statusFilter])

  const fetchAttendance = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/students/me/attendance')
      setRecords(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <><PageHeader title="My Attendance" /><LoadingSkeleton rows={10} columns={5} /></>
  if (error) return <ErrorState message={error} retryAction={fetchAttendance} />
  if (records.length === 0) return <><PageHeader title="My Attendance" /><EmptyState title="No attendance records" /></>

  const columns = [
    { key: 'date', label: 'Date' },
    { key: 'subject', label: 'Subject' },
    { key: 'className', label: 'Class' },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    { key: 'checkin', label: 'Check-in Time' },
  ]

  return (
    <>
      <PageHeader title="My Attendance" subtitle={`${records.length} total records`} />
      <div className="page-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: '0.75rem 1rem', border: '1px solid var(--border)', borderRadius: '12px' }}>
          <option value="">All Statuses</option>
          <option value="present">Present</option>
          <option value="absent">Absent</option>
          <option value="late">Late</option>
          <option value="excused">Excused</option>
        </select>
      </div>
      <DataTable columns={columns} data={filtered} />
    </>
  )
}

export default MyAttendance
