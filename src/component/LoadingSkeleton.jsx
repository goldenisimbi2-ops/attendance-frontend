import PropTypes from 'prop-types'

function LoadingSkeleton({ rows = 5, columns = 4, type = 'table' }) {
  if (type === 'cards') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="page-card" style={{ padding: '1.5rem' }}>
            <div style={{ height: '20px', background: '#e2e8f0', borderRadius: '8px', marginBottom: '1rem' }} />
            <div style={{ height: '16px', background: '#e2e8f0', borderRadius: '8px', marginBottom: '0.75rem' }} />
            <div style={{ height: '16px', background: '#e2e8f0', borderRadius: '8px', width: '80%' }} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="table-panel" style={{ overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} style={{ padding: '1rem', textAlign: 'left' }}>
                <div style={{ height: '16px', background: '#e2e8f0', borderRadius: '4px' }} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <tr key={rowIdx} style={{ borderTop: '1px solid var(--border)' }}>
              {Array.from({ length: columns }).map((_, colIdx) => (
                <td key={colIdx} style={{ padding: '1rem' }}>
                  <div style={{ height: '16px', background: '#e2e8f0', borderRadius: '4px' }} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

LoadingSkeleton.propTypes = {
  rows: PropTypes.number,
  columns: PropTypes.number,
  type: PropTypes.oneOf(['table', 'cards']),
}

export default LoadingSkeleton
