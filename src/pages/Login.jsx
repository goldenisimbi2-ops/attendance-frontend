import { useEffect, useState } from 'react'
import { Eye, EyeOff, GraduationCap, LayoutDashboard, ShieldCheck, Users } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../app/store'
import Button from '../component/ui/Button'

function Login() {
  const navigate = useNavigate()
  const { login, isAuthenticated, user } = useAuth()
  const [form, setForm] = useState({
    email: 'goldenisimbi@gmail.com',
    password: 'isimbi2009',
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || !user) return

    const role = (user.role || '').toLowerCase()
    if (role === 'admin') navigate('/dashboard', { replace: true })
    else if (role === 'head_teacher' || role === 'head-teacher') navigate('/head-teacher/dashboard', { replace: true })
    else if (role === 'teacher') navigate('/teacher/dashboard', { replace: true })
    else navigate('/student/dashboard', { replace: true })
  }, [isAuthenticated, navigate, user])

  const validate = () => {
    const nextErrors = {}
    if (!form.email.trim()) nextErrors.email = 'Email is required.'
    if (!form.password) nextErrors.password = 'Password is required.'
    return nextErrors
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) return

    try {
      setIsSubmitting(true)
      const loggedInUser = await login({ email: form.email, password: form.password })
      const role = (loggedInUser?.role || '').toLowerCase()

      if (role === 'admin') navigate('/dashboard')
      else if (role === 'head_teacher' || role === 'head-teacher') navigate('/head-teacher/dashboard')
      else if (role === 'teacher') navigate('/teacher/dashboard')
      else navigate('/student/dashboard')
    } catch (error) {
      setErrors({ form: error.message || 'Unable to log in. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-layout">
        <aside className="auth-hero">
          <div className="auth-hero__badge">Attendance Management System</div>
          <h1>Track attendance with clarity, speed, and confidence.</h1>
          <p>
            Manage students, teachers, classes, and daily attendance from one powerful platform built for modern schools.
          </p>

          <div className="auth-feature-grid">
            <div className="feature-item">
              <div className="feature-icon"><Users size={18} /></div>
              <div>
                <strong>Student visibility</strong>
                <span>Monitor attendance trends instantly.</span>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon"><LayoutDashboard size={18} /></div>
              <div>
                <strong>Live dashboards</strong>
                <span>See performance across the campus.</span>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon"><GraduationCap size={18} /></div>
              <div>
                <strong>Class coordination</strong>
                <span>Organize sessions and classes effortlessly.</span>
              </div>
            </div>
          </div>
        </aside>

        <section className="auth-panel">
          <div className="auth-brand">
            <div className="auth-brand__mark">A</div>
            <div>
              <span className="eyebrow">Secure access</span>
              <h2>Attendify</h2>
            </div>
          </div>

          <div className="auth-copy">
            <h3>Welcome back</h3>
            <p>Sign in to continue to your dashboard.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="email">Email address</label>
              <input id="email" type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
              {errors.email ? <small className="field-error">{errors.email}</small> : null}
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <div className="password-field">
                <input id="password" type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} placeholder="Enter your password" />
                <button type="button" className="password-toggle" onClick={() => setShowPassword((prev) => !prev)} aria-label="Toggle password visibility">
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.password ? <small className="field-error">{errors.password}</small> : null}
            </div>

            <div className="auth-options">
              <label className="checkbox-row">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="/login">Forgot password?</a>
            </div>

            {errors.form ? <div className="message-box message-box--danger">{errors.form}</div> : null}

            <Button type="submit" className="auth-submit" disabled={isSubmitting}>
              <ShieldCheck size={16} />
              {isSubmitting ? 'Signing in...' : 'Login'}
            </Button>
          </form>

          <p className="auth-footer">
            Need an account? <Link to="/register">Create one</Link>
          </p>
        </section>
      </div>
    </div>
  )
}

export default Login
