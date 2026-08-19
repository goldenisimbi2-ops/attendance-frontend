import PropTypes from 'prop-types'

function EmptyState({ icon: Icon, title, message, action, actionLabel }) {
  return (
    <div className="empty-state" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
      {Icon && (
        <div style={{ marginBottom: '1rem', color: 'var(--muted)' }}>
          <Icon size={48} strokeWidth={1.5} style={{ opacity: 0.5 }} />
        </div>
      )}
      <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>{title}</h3>
      {message && <p className="muted" style={{ marginBottom: '1.5rem' }}>{message}</p>}
      {action && (
        <button onClick={action} className="btn btn-primary">
          {actionLabel || 'Take Action'}
        </button>
      )}
    </div>
  )
}

EmptyState.propTypes = {
  icon: PropTypes.elementType,
  title: PropTypes.string.isRequired,
  message: PropTypes.string,
  action: PropTypes.func,
  actionLabel: PropTypes.string,
}

export default EmptyState
