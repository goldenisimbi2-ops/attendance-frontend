function Footer() {
  return (
    <footer className="footer">
      <div>
        <strong>Attendify</strong>
        <span>© {new Date().getFullYear()} All rights reserved.</span>
      </div>
      <nav>
        <a href="/dashboard">Dashboard</a>
        <a href="/profile">Profile</a>
      </nav>
    </footer>
  )
}

export default Footer
