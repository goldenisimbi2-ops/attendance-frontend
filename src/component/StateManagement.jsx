import { useStore } from '../app/store'

function StateManagement() {
  const { user, logout } = useStore()

  return (
    <div className="state-management shell-card">
      <h2>Session status</h2>
      <p>{user ? `Signed in as ${user.name || user.email || 'user'}.` : 'No active session.'}</p>
      {user ? <button type="button" onClick={logout}>Sign out</button> : null}
    </div>
  )
}

export default StateManagement
