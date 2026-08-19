import { useEffect, useMemo, useState } from 'react'
import api, { getErrorMessage } from '../../app/api'
import Button from '../../component/ui/Button'
import Spinner from '../../component/ui/Spinner'

function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const loadUsers = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/users')
      setUsers(Array.isArray(data) ? data : data.users || [])
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesQuery = [user.firstName, user.lastName, user.email].join(' ').toLowerCase().includes(query.toLowerCase())
      const matchesRole = roleFilter === 'all' || user.role === roleFilter
      const matchesStatus = statusFilter === 'all' || String(user.status || 'active') === statusFilter
      return matchesQuery && matchesRole && matchesStatus
    })
  }, [users, query, roleFilter, statusFilter])

  const toggleStatus = async (id, status) => {
    try {
      await api.patch(`/users/${id}/status`, { status: status === 'active' ? 'inactive' : 'active' })
      loadUsers()
    } catch (err) {
      console.error(getErrorMessage(err))
    }
  }

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return

    try {
      await api.delete(`/users/${id}`)
      setUsers((current) => current.filter((user) => user.id !== id))
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  return (
    <div>
      <div className="page-header">
        <h2>User Management</h2>
        <div className="page-actions">
          <Button variant="secondary">Add user</Button>
        </div>
      </div>

      <div className="page-card">
        <div className="form-grid" style={{ marginBottom: '1rem' }}>
          <div className="field">
            <label>Search</label>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or email" />
          </div>
          <div className="field">
            <label>Role</label>
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="admin">Admin</option>
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
            </select>
          </div>
          <div className="field">
            <label>Status</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading-card"><Spinner size="large" /><h3>Loading users...</h3></div>
        ) : error ? (
          <div className="error-state"><h3>Unable to load users</h3><p>{error}</p></div>
        ) : filteredUsers.length === 0 ? (
          <div className="empty-state"><h3>No users found.</h3></div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.firstName} {user.lastName}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.phone || '—'}</td>
                    <td>
                      <span className={`badge ${user.status === 'inactive' ? 'warning' : 'success'}`}>
                        {user.status || 'active'}
                      </span>
                    </td>
                    <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</td>
                    <td>
                      <div className="page-actions">
                        <Button variant="secondary" onClick={() => console.log(user)}>View</Button>
                        <Button variant="secondary" onClick={() => toggleStatus(user.id, user.status || 'active')}>Toggle</Button>
                        <Button variant="danger" onClick={() => deleteUser(user.id)}>Delete</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Users
