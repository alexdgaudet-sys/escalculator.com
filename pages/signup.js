import { useState } from 'react'
import Link from 'next/link'
import styles from '../styles/Auth.module.css'

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Validation
      if (!formData.firstName || !formData.email || !formData.password) {
        setError('Please fill in all required fields')
        setLoading(false)
        return
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match')
        setLoading(false)
        return
      }

      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters')
        setLoading(false)
        return
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))

      alert('Sign up would work once backend is set up!\n\nFor now:\n1. Set up Supabase account\n2. Enable email auth\n3. Connect to this page\n4. User will receive verification email')
      setLoading(false)
    } catch (err) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      {/* Left side - branding */}
      <div className={styles.branding}>
        <div className={styles.brandContent}>
          <div className={styles.logo}>
            <div className={styles.logoMark}>≈</div>
            <div>Surplus Lines Tax</div>
          </div>
          <h2>Join 500+ brokers and MGAs</h2>
          <p>
            Simplify surplus lines compliance. Calculate taxes, generate forms, and save time across all 50 states.
          </p>
          <div className={styles.features}>
            <div className={styles.feature}>
              <span>✓</span>
              <div>
                <strong>Free forever plan</strong>
                <p>Single-policy calculator included</p>
              </div>
            </div>
            <div className={styles.feature}>
              <span>✓</span>
              <div>
                <strong>Start free, upgrade anytime</strong>
                <p>No credit card required to start</p>
              </div>
            </div>
            <div className={styles.feature}>
              <span>✓</span>
              <div>
                <strong>14-day Pro trial</strong>
                <p>Full access, cancel anytime</p>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.brandFooter}>
          <p>
            Already have an account? <Link href="/login" style={{ color: 'white', textDecoration: 'underline' }}>Sign in</Link>
          </p>
        </div>
      </div>

      {/* Right side - signup form */}
      <div className={styles.authForm}>
        <div className={styles.formWrapper}>
          <h1>Create your account</h1>
          <p>Join in 2 minutes. Free tier includes full calculator.</p>

          {error && <div className={styles.alert}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className={styles.field}>
                <label htmlFor="firstName">First name *</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="Jane"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="lastName">Last name</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="email">Email address *</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@agency.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="company">Agency or company name</label>
              <input
                id="company"
                name="company"
                type="text"
                placeholder="Your agency"
                value={formData.company}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="password">Password *</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />
              <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>At least 8 characters</p>
            </div>

            <div className={styles.field}>
              <label htmlFor="confirmPassword">Confirm password *</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <label style={{ display: 'flex', gap: '8px', fontSize: '12px', color: 'var(--muted)', marginBottom: '20px' }}>
              <input type="checkbox" required />
              I agree to the <a href="/terms" className={styles.link}>Terms of Service</a> and <a href="/privacy" className={styles.link}>Privacy Policy</a>
            </label>

            <button 
              type="submit" 
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <div className={styles.footer}>
            <p>
              Already have an account? <Link href="/login" className={styles.link}>Sign in here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
