import PropTypes from 'prop-types'

function Select({ label, options = [], error, className = '', ...props }) {
  return (
    <div className="field">
      {label ? <label>{label}</label> : null}
      <select className={className} {...props}>
        {options.map((option) => (
          <option key={option.value ?? option.label} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <small className="muted">{error}</small> : null}
    </div>
  )
}

Select.propTypes = {
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.string,
    }),
  ),
  error: PropTypes.string,
  className: PropTypes.string,
}

export default Select
