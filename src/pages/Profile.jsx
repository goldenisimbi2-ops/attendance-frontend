import { useEffect, useState } from 'react'
import api, { getErrorMessage } from '../app/api'
import { useAuth } from '../app/store'
import Button from '../component/ui/Button'
import Input from '../component/ui/Input'

function Profile() {
  const { user, setUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  })

  useEffect(() => {
    setForm({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
    })
  }, [user])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)

    try {
      const { data } = await api.put(`/users/${user.id}`, form)
      setUser(data.user || data)
      setEditing(false)
    } catch (error) {
      console.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="page-card">
      <div className="page-header">
        <h2>Profile</h2>
        <div className="page-actions">
          {!editing ? (
            <Button variant="secondary" onClick={() => setEditing(true)}>Edit profile</Button>
          ) : (
            <Button variant="secondary" onClick={() => setEditing(false)}>Cancel</Button>
          )}
        </div>
      </div>

      {!editing ? (
        <div className="form-grid">
          <div className="field"><label>First name</label><input value={user.firstName || ''} readOnly /></div>
          <div className="field"><label>Last name</label><input value={user.lastName || ''} readOnly /></div>
          <div className="field"><label>Email</label><input value={user.email || ''} readOnly /></div>
          <div className="field"><label>Phone</label><input value={user.phone || ''} readOnly /></div>
          <div className="field"><label>Role</label><input value={user.role || ''} readOnly /></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <Input label="First name" name="firstName" value={form.firstName} onChange={handleChange} />
            <Input label="Last name" name="lastName" value={form.lastName} onChange={handleChange} />
            <Input label="Email" name="email" value={form.email} onChange={handleChange} />
            <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />
          </div>
          <div className="form-actions" style={{ marginTop: '1rem' }}>
            <Button variant="secondary" type="button" onClick={() => setEditing(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save changes'}</Button>
          </div>
        </form>
      )}
    </div>
  )
}

export default Profile
