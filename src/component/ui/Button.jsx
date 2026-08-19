import PropTypes from 'prop-types'

function Button({ children, type = 'button', variant = 'primary', className = '', disabled = false, ...props }) {
  const variantClass = variant === 'secondary' ? 'btn btn-secondary' : variant === 'danger' ? 'btn btn-danger' : 'btn btn-primary'

  return (
    <button type={type} className={`${variantClass} ${className}`.trim()} disabled={disabled} {...props}>
      {children}
    </button>
  )
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.string,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger']),
  className: PropTypes.string,
  disabled: PropTypes.bool,
}

export default Button
