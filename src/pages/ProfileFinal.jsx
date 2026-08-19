import { useEffect, useState } from 'react'
import api from '../../app/api'
import { useAuth } from '../../app/store'
import PageHeader from '../../component/PageHeader'
import LoadingSkeleton from '../../component/LoadingSkeleton'
import ErrorState from '../../component/ErrorState'
import { User, Mail, Phone, BookOpen, GraduationCap } from 'lucide-react'

function Profile() {
  const { user, logout } = useAuth()
  const [profile, setProfile] = useState(user)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (user) setProfile(user)
  }, [user])

  if (loading) return <><PageHeader title="Profile" /><LoadingSkeleton rows={1} columns={1} type="cards" /></>

  const userRole = profile?.role || 'User'
  const userName = profile?.firstName ? `${profile.firstName} ${profile.lastName || ''}`.trim() : profile?.name || 'User'

  return (
    <>
      <PageHeader title="Profile" subtitle="Your account information" />
      <div className="page-card" style={{ padding: '2rem', maxWidth: '500px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#dbeafe', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', marginBottom: '1rem' }}>
            <User size={40} />
          </div>
          <h2>{userName}</h2>
          <p className="muted" style={{ textTransform: 'uppercase', fontSize: '0.85rem' }}>{userRole}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'var(--surface-soft)', borderRadius: '12px' }}>
            <Mail size={20} style={{ color: 'var(--muted)' }} />
            <div>
              <p className="muted" style={{ fontSize: '0.85rem' }}>Email</p>
              <strong>{profile?.email}</strong>
            </div>
          </div>

          {profile?.phone && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'var(--surface-soft)', borderRadius: '12px' }}>
              <Phone size={20} style={{ color: 'var(--muted)' }} />
              <div>
                <p className="muted" style={{ fontSize: '0.85rem' }}>Phone</p>
                <strong>{profile.phone}</strong>
              </div>
            </div>
          )}

          {profile?.studentNumber && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'var(--surface-soft)', borderRadius: '12px' }}>
              <GraduationCap size={20} style={{ color: 'var(--muted)' }} />
              <div>
                <p className="muted" style={{ fontSize: '0.85rem' }}>Student Number</p>
                <strong>{profile.studentNumber}</strong>
              </div>
            </div>
          )}

          {profile?.employeeNumber && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'var(--surface-soft)', borderRadius: '12px' }}>
              <BookOpen size={20} style={{ color: 'var(--muted)' }} />
              <div>
                <p className="muted" style={{ fontSize: '0.85rem' }}>Employee Number</p>
                <strong>{profile.employeeNumber}</strong>
              </div>
            </div>
          )}

          <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
            <button className="btn btn-secondary" style={{ flex: 1 }}>Edit Profile</button>
            <button className="btn btn-danger" style={{ flex: 1 }} onClick={logout}>Logout</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile
