import PropTypes from 'prop-types'

function Input({ label, error, className = '', ...props }) {
  return (
    <div className="field">
      {label ? <label>{label}</label> : null}
      <input className={className} {...props} />
      {error ? <small className="muted">{error}</small> : null}
    </div>
  )
}

Input.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  className: PropTypes.string,
}

export default Input
