import { useState } from 'react'
import Link from 'next/link'
import styles from '../styles/Auth.module.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // This is a placeholder. In real implementation, connect to Supabase or your auth service
    try {
      // Example: const { user, error } = await supabase.auth.signInWithPassword({...})
      // For now, just validate and redirect
      if (!email || !password) {
        setError('Please enter email and password')
        setLoading(false)
        return
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))

      // In real app: if (error) { setError(error.message); return; }
      // Then redirect to dashboard: router.push('/dashboard')
      alert('Login would work once backend is set up!\n\nFor now:\n1. Set up Supabase account\n2. Enable email auth\n3. Connect to this page\n4. User data will persist')
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
          <h2>Calculate. Comply. Close faster.</h2>
          <p>
            Tax calculations and compliance forms for all 50 states. Used by brokers, MGAs, and wholesalers.
          </p>
          <div className={styles.features}>
            <div className={styles.feature}>
              <span>✓</span>
              <div>
                <strong>All 50 states</strong>
                <p>Tax, stamping fees, and filing charges</p>
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

          {error && <div className={styles.alert}>{error}</div>}

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
              />
            </div>

            <button 
              type="submit" 
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className={styles.divider}>or</div>

          <button className={styles.demoBtn}>
            Demo account (test access)
          </button>

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
