import PropTypes from 'prop-types'

function PageHeader({ title, subtitle, actions, hero = false }) {
  return (
    <div className={`page-header ${hero ? 'page-header--hero' : ''}`}>
      <div>
        {title && <h2>{title}</h2>}
        {subtitle && <p className="muted">{subtitle}</p>}
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </div>
  )
}

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  actions: PropTypes.node,
  hero: PropTypes.bool,
}

export default PageHeader
