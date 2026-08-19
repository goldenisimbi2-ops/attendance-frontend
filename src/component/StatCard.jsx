import PropTypes from 'prop-types'

function StatCard({ icon: Icon, label, value, trend, trendLabel, loading = false }) {
  if (loading) {
    return (
      <div className="metric-card">
        <div className="metric-card__icon" style={{ background: '#e2e8f0' }} />
        <div className="metric-card__content" style={{ flex: 1 }}>
          <div style={{ height: '12px', background: '#e2e8f0', borderRadius: '4px', marginBottom: '8px' }} />
          <div style={{ height: '24px', background: '#e2e8f0', borderRadius: '4px' }} />
        </div>
      </div>
    )
  }

  return (
    <div className="metric-card">
      {Icon && (
        <div className="metric-card__icon">
          <Icon size={24} />
        </div>
      )}
      <div className="metric-card__content">
        <p className="muted small-text" style={{ marginBottom: '0.25rem' }}>
          {label}
        </p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
          <strong style={{ fontSize: '1.75rem' }}>{value}</strong>
          {trend && (
            <span className={`trend-badge ${trend > 0 ? 'trend-up' : 'trend-down'}`}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          )}
        </div>
        {trendLabel && <p className="muted small-text">{trendLabel}</p>}
      </div>
    </div>
  )
}

StatCard.propTypes = {
  icon: PropTypes.elementType,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  trend: PropTypes.number,
  trendLabel: PropTypes.string,
  loading: PropTypes.bool,
}

export default StatCard
