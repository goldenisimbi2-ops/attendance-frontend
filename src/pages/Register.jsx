import { useState } from 'react'
import { ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../app/store'
import Button from '../component/ui/Button'

const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  role: 'student',
}

function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [form, setForm] = useState(initialState)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validate = () => {
    const nextErrors = {}

    if (!form.firstName.trim()) nextErrors.firstName = 'First name is required.'
    if (!form.lastName.trim()) nextErrors.lastName = 'Last name is required.'
    if (!form.email.trim()) nextErrors.email = 'Email is required.'
    else if (!/\S+@\S+\.\S+/.test(form.email)) nextErrors.email = 'Please enter a valid email.'
    if (!form.phone.trim()) nextErrors.phone = 'Phone number is required.'
    if (!form.password) nextErrors.password = 'Password is required.'
    else if (form.password.length < 6) nextErrors.password = 'Password must be at least 6 characters.'
    if (!form.confirmPassword) nextErrors.confirmPassword = 'Confirm your password.'
    else if (form.confirmPassword !== form.password) nextErrors.confirmPassword = 'Passwords do not match.'

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

    if (Object.keys(nextErrors).length) return

    try {
      setIsSubmitting(true)
      await register({ ...form, role: 'student' })
      navigate('/login')
    } catch (error) {
      setErrors({ form: error.message || 'Unable to create account right now.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-layout auth-layout--compact">
        <aside className="auth-hero auth-hero--register">
          <div className="auth-hero__badge">Create your account</div>
          <h1>Start managing attendance with a smarter workflow.</h1>
          <p>
            Build a reliable attendance routine for your classes, sessions, and student records from day one.
          </p>

          <ul className="register-bullets">
            <li><CheckCircle2 size={18} /> Student-ready profile</li>
            <li><CheckCircle2 size={18} /> Secure access controls</li>
            <li><CheckCircle2 size={18} /> Fast session tracking</li>
          </ul>
        </aside>

        <section className="auth-panel">
          <div className="auth-brand">
            <div className="auth-brand__mark">A</div>
            <div>
              <span className="eyebrow">New account</span>
              <h2>Attendify</h2>
            </div>
          </div>

          <div className="auth-copy">
            <h3>Create your profile</h3>
            <p>Set up your account to access the attendance platform.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="form-grid form-grid--auth">
              <div className="field">
                <label htmlFor="firstName">First name</label>
                <input id="firstName" name="firstName" value={form.firstName} onChange={handleChange} />
                {errors.firstName ? <small className="field-error">{errors.firstName}</small> : null}
              </div>

              <div className="field">
                <label htmlFor="lastName">Last name</label>
                <input id="lastName" name="lastName" value={form.lastName} onChange={handleChange} />
                {errors.lastName ? <small className="field-error">{errors.lastName}</small> : null}
              </div>

              <div className="field auth-span-2">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" name="email" value={form.email} onChange={handleChange} />
                {errors.email ? <small className="field-error">{errors.email}</small> : null}
              </div>

              <div className="field auth-span-2">
                <label htmlFor="phone">Phone</label>
                <input id="phone" name="phone" value={form.phone} onChange={handleChange} />
                {errors.phone ? <small className="field-error">{errors.phone}</small> : null}
              </div>

              <div className="field">
                <label htmlFor="password">Password</label>
                <input id="password" type="password" name="password" value={form.password} onChange={handleChange} />
                {errors.password ? <small className="field-error">{errors.password}</small> : null}
              </div>

              <div className="field">
                <label htmlFor="confirmPassword">Confirm password</label>
                <input id="confirmPassword" type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} />
                {errors.confirmPassword ? <small className="field-error">{errors.confirmPassword}</small> : null}
              </div>
            </div>

            {errors.form ? <div className="message-box message-box--danger">{errors.form}</div> : null}

            <Button type="submit" className="auth-submit" disabled={isSubmitting}>
              <ShieldCheck size={16} />
              {isSubmitting ? 'Creating account...' : 'Register'}
            </Button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </section>
      </div>
    </div>
  )
}

export default Register
