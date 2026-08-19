import { useEffect, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import api from '../../app/api'
import PageHeader from '../../component/PageHeader'
import DataTable from '../../component/DataTable'
import LoadingSkeleton from '../../component/LoadingSkeleton'
import ErrorState from '../../component/ErrorState'
import EmptyState from '../../component/EmptyState'
import StatusBadge from '../../component/StatusBadge'
import Button from '../../component/ui/Button'

function AttendanceSessions() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/attendance-sessions')
      setSessions(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const filtered = sessions.filter((s) => s.title?.toLowerCase().includes(searchTerm.toLowerCase()))

  if (loading) return <><PageHeader title="Attendance Sessions" /><LoadingSkeleton rows={6} columns={5} /></>
  if (error) return <ErrorState message={error} retryAction={fetchSessions} />
  if (sessions.length === 0) {
    return (
      <>
        <PageHeader title="Attendance Sessions" />
        <EmptyState title="No sessions found" message="Create a new attendance session to get started." actionLabel="Create Session" />
      </>
    )
  }

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'className', label: 'Class' },
    { key: 'date', label: 'Date' },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status || 'pending'} /> },
  ]

  return (
    <>
      <PageHeader title="Attendance Sessions" subtitle={`${sessions.length} total sessions`} actions={<Button className="btn-primary"><Plus size={16} /> Create Session</Button>} />
      <div className="page-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--muted)' }} />
          <input type="text" placeholder="Search sessions..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '0.9rem' }} />
        </div>
      </div>
      <DataTable columns={columns} data={filtered} />
    </>
  )
}

export default AttendanceSessions
