import { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'
import Link from 'next/link'
import styles from '../styles/Auth.module.css'

export default function Signup() {
  const router = useRouter()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (!firstName || !email || !password) {
      setError('First name, email, and password are required')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      setLoading(false)
      return
    }

    try {
      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            company: company,
          },
        },
      })

      if (signupError) {
        setError(signupError.message)
        setLoading(false)
        return
      }

      setSuccess('✓ Account created! Check your email to confirm.')
      
      setFirstName('')
      setLastName('')
      setEmail('')
      setCompany('')
      setPassword('')
      setConfirmPassword('')

      setTimeout(() => {
        router.push('/login')
      }, 2000)

    } catch (err) {
      setError('Error: ' + err.message)
    }

    setLoading(false)
  }

  return (
    <div className={styles.page}>
      <div className={styles.branding}>
        <div className={styles.brandContent}>
          <div className={styles.logo}>
            <div className={styles.logoMark}>≈</div>
            <div>E&S Calculator</div>
          </div>
          <h2>Join hundreds of brokers</h2>
          <p>Simplify surplus lines compliance. Calculate taxes, generate forms, save time.</p>
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
                <p>No credit card required</p>
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

      <div className={styles.authForm}>
        <div className={styles.formWrapper}>
          <h1>Create your account</h1>
          <p>Join in 2 minutes. Free tier includes full calculator.</p>

          {error && <div className={styles.alert} style={{ color: '#c41e3a', background: '#ffe6eb', borderLeft: '3px solid #c41e3a' }}>{error}</div>}
          {success && <div className={styles.alert} style={{ color: '#0E6E5C', background: '#e3f2ed', borderLeft: '3px solid #0E6E5C' }}>{success}</div>}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className={styles.field}>
                <label htmlFor="firstName">First name *</label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="Jane"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="lastName">Last name</label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="email">Email address *</label>
              <input
                id="email"
                type="email"
                placeholder="you@agency.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="company">Agency or company name</label>
              <input
                id="company"
                type="text"
                placeholder="Your agency"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="password">Password *</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
              <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>At least 8 characters</p>
            </div>

            <div className={styles.field}>
              <label htmlFor="confirmPassword">Confirm password *</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <label style={{ display: 'flex', gap: '8px', fontSize: '12px', color: 'var(--muted)', marginBottom: '20px' }}>
              <input type="checkbox" required />
              I agree to the <a href="/terms" style={{ color: 'var(--teal)', textDecoration: 'underline' }}>Terms of Service</a> and <a href="/privacy" style={{ color: 'var(--teal)', textDecoration: 'underline' }}>Privacy Policy</a>
            </label>

            <button 
              type="submit" 
              className={styles.submitBtn}
              disabled={loading}
              style={{ opacity: loading ? 0.6 : 1 }}
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
