import PropTypes from 'prop-types'

function StatusBadge({ status }) {
  const statusMap = {
    active: { bg: '#d1fae5', text: '#059669', label: 'Active' },
    inactive: { bg: '#fee2e2', text: '#dc2626', label: 'Inactive' },
    present: { bg: '#d1fae5', text: '#059669', label: 'Present' },
    absent: { bg: '#fee2e2', text: '#dc2626', label: 'Absent' },
    late: { bg: '#fef3c7', text: '#b45309', label: 'Late' },
    excused: { bg: '#dbeafe', text: '#0369a1', label: 'Excused' },
    pending: { bg: '#f3e8ff', text: '#7e22ce', label: 'Pending' },
  }

  const config = statusMap[status?.toLowerCase()] || statusMap.pending

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        backgroundColor: config.bg,
        color: config.text,
        padding: '0.4rem 0.75rem',
        borderRadius: '8px',
        fontSize: '0.75rem',
        fontWeight: '600',
        textTransform: 'capitalize',
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: config.text,
        }}
      />
      {config.label}
    </span>
  )
}

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
}

export default StatusBadge
