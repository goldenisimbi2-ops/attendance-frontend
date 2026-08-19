import { useEffect, useState } from 'react'
import api from '../../app/api'
import PageHeader from '../../component/PageHeader'
import DataTable from '../../component/DataTable'
import LoadingSkeleton from '../../component/LoadingSkeleton'
import ErrorState from '../../component/ErrorState'
import EmptyState from '../../component/EmptyState'
import StatusBadge from '../../component/StatusBadge'

function AttendanceHistory() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/teachers/me/attendance')
      setRecords(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <><PageHeader title="Attendance History" /><LoadingSkeleton rows={10} columns={5} /></>
  if (error) return <ErrorState message={error} retryAction={fetchHistory} />
  if (records.length === 0) return <><PageHeader title="Attendance History" /><EmptyState title="No attendance records" /></>

  const columns = [
    { key: 'studentName', label: 'Student' },
    { key: 'className', label: 'Class' },
    { key: 'date', label: 'Date' },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
  ]

  return (
    <>
      <PageHeader title="Attendance History" subtitle={`${records.length} total records`} />
      <DataTable columns={columns} data={records} />
    </>
  )
}

export default AttendanceHistory
