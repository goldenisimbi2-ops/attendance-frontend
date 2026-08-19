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

function MyClasses() {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/teachers/me/classes')
      setClasses(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const filtered = classes.filter((c) => c.name?.toLowerCase().includes(searchTerm.toLowerCase()))

  if (loading) return <><PageHeader title="My Classes" /><LoadingSkeleton rows={6} columns={4} /></>
  if (error) return <ErrorState message={error} retryAction={fetchClasses} />
  if (classes.length === 0) {
    return (
      <>
        <PageHeader title="My Classes" />
        <EmptyState title="No classes assigned" message="You don't have any classes yet." />
      </>
    )
  }

  const columns = [
    { key: 'name', label: 'Class Name' },
    { key: 'subject', label: 'Subject' },
    { key: 'students', label: 'Students', render: (r) => r.students?.length || 0 },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status="active" /> },
  ]

  return (
    <>
      <PageHeader title="My Classes" subtitle={`You're teaching ${classes.length} classes`} actions={<Button className="btn-primary"><Plus size={16} /> Create Session</Button>} />
      <div className="page-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--muted)' }} />
          <input type="text" placeholder="Search classes..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '0.9rem' }} />
        </div>
      </div>
      <DataTable columns={columns} data={filtered} />
    </>
  )
}

export default MyClasses
