import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'
import Sidebar from './Sidebar'
import Footer from './Footer'
import { useAuth } from '../app/store'

function Layout() {
  const { user } = useAuth()

  return (
    <div className="app-shell">
      <div className="app-shell__layout">
        {user ? <Sidebar /> : null}
        <div className="app-shell__content">
          <NavBar />
          <main className="app-main">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  )
}

export default Layout
