import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import api from '../../app/api'
import PageHeader from '../../component/PageHeader'
import DataTable from '../../component/DataTable'
import LoadingSkeleton from '../../component/LoadingSkeleton'
import ErrorState from '../../component/ErrorState'
import EmptyState from '../../component/EmptyState'
import StatusBadge from '../../component/StatusBadge'

function Attendance() {
  const [records, setRecords] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({ date: '', className: '', status: '' })

  useEffect(() => {
    fetchAttendance()
  }, [])

  useEffect(() => {
    let result = records
    if (filters.status) result = result.filter((r) => r.status === filters.status)
    if (filters.className) result = result.filter((r) => r.className?.includes(filters.className))
    setFiltered(result)
  }, [records, filters])

  const fetchAttendance = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/attendance/session/all')
      setRecords(Array.isArray(data) ? data : [])
    } catch (err) {
      // Fallback if endpoint doesn't exist
      setRecords([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <><PageHeader title="Attendance Monitoring" /><LoadingSkeleton rows={10} columns={6} /></>
  if (error) return <ErrorState message={error} retryAction={fetchAttendance} />
  if (records.length === 0) return <><PageHeader title="Attendance Monitoring" /><EmptyState title="No attendance records" /></>

  const columns = [
    { key: 'studentName', label: 'Student' },
    { key: 'className', label: 'Class' },
    { key: 'date', label: 'Date' },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
  ]

  return (
    <>
      <PageHeader title="Attendance Monitoring" subtitle={`${records.length} total records`} />
      <div className="page-card" style={{ padding: '1.5rem', marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <input type="text" placeholder="Filter by class..." value={filters.className} onChange={(e) => setFilters({ ...filters, className: e.target.value })} style={{ padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '12px' }} />
        <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} style={{ padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '12px' }}>
          <option value="">All Statuses</option>
          <option value="present">Present</option>
          <option value="absent">Absent</option>
          <option value="late">Late</option>
        </select>
      </div>
      <DataTable columns={columns} data={filtered} />
    </>
  )
}

export default Attendance
