import { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'
import Link from 'next/link'
import styles from '../styles/Auth.module.css'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (loginError) {
        setError(loginError.message)
        setLoading(false)
        return
      }

      // Success! Redirect to dashboard
      router.push('/dashboard')

    } catch (err) {
      setError('Error: ' + err.message)
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
            <div>E&S Calculator</div>
          </div>
          <h2>Calculate. Comply. Close faster.</h2>
          <p>Tax calculations and compliance forms for all 50 states. Used by brokers, MGAs, and wholesalers.</p>
          <div className={styles.features}>
            <div className={styles.feature}>
              <span>✓</span>
              <div>
                <strong>All 50 states</strong>
                <p>Tax, stamping fees, filing charges</p>
              </div>
            </div>
            <div className={styles.feature}>
              <span>✓</span>
              <div>
                <strong>Batch upload</strong>
                <p>Calculate 100+ policies at once</p>
              </div>
            </div>
            <div className={styles.feature}>
              <span>✓</span>
              <div>
                <strong>Compliance forms</strong>
                <p>Generate SDE forms by state</p>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.brandFooter}>
          <p>
            Questions? <a href="mailto:support@surpluslinestax.com">Email us</a>
          </p>
        </div>
      </div>

      {/* Right side - login form */}
      <div className={styles.authForm}>
        <div className={styles.formWrapper}>
          <h1>Sign in to your account</h1>
          <p>Continue to access your calculations and compliance forms.</p>

          {error && <div className={styles.alert} style={{ color: '#c41e3a', background: '#ffe6eb', borderLeft: '3px solid #c41e3a' }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label htmlFor="email">Email address</label>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label htmlFor="password">Password</label>
                <Link href="/forgot-password" className={styles.link}>Forgot?</Link>
              </div>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <button 
              type="submit" 
              className={styles.submitBtn}
              disabled={loading}
              style={{ opacity: loading ? 0.6 : 1 }}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className={styles.footer}>
            <p>
              Don't have an account? <Link href="/signup" className={styles.link}>Sign up free</Link>
            </p>
            <p style={{ marginTop: '12px', fontSize: '12px', color: 'var(--muted)' }}>
              By signing in, you agree to our <a href="/terms" className={styles.link}>Terms of Service</a> and <a href="/privacy" className={styles.link}>Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
