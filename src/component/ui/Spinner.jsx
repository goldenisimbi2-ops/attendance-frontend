import PropTypes from 'prop-types'

function Spinner({ size = 'medium' }) {
  return <div className={`spinner ${size}`} aria-label="Loading" />
}

Spinner.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
}

export default Spinner
