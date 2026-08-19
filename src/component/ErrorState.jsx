import { AlertCircle } from 'lucide-react'
import PropTypes from 'prop-types'

function ErrorState({ message, retryAction, status }) {
  return (
    <div className="error-state" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
      <div style={{ marginBottom: '1rem', color: 'var(--danger)' }}>
        <AlertCircle size={48} />
      </div>
      {status && (
        <div style={{ fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>
          Error {status}
        </div>
      )}
      <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Something went wrong</h3>
      <p className="muted" style={{ marginBottom: '1.5rem' }}>
        {message || 'We couldn\'t load this information. Please try again.'}
      </p>
      {retryAction && (
        <button onClick={retryAction} className="btn btn-primary">
          Try Again
        </button>
      )}
    </div>
  )
}

ErrorState.propTypes = {
  message: PropTypes.string,
  retryAction: PropTypes.func,
  status: PropTypes.number,
}

export default ErrorState
