import Link from 'next/link'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'
import styles from '../styles/Dashboard.module.css'

export default function Dashboard() {
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }
  const user = {
    name: 'Welcome User',
    email: 'user@agency.com',
    company: 'Your Agency',
    plan: 'free',
  }

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px' }}>
          <div className={styles.logo}>E&S Calculator</div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span className={styles.userEmail}>{user.email}</span>
        <button className={styles.logoutBtn} onClick={handleLogout}>Sign out</button>
          </div>
        </div>
      </nav>

      <main className={styles.main}>
        <div className="container">
          <div className={styles.welcome}>
            <div>
              <h1>Welcome, {user.name.split(' ')[0]}</h1>
              <p>You're on the <strong>Free plan</strong></p>
            </div>
            <Link href="/" className="btn">
              Back to Home
            </Link>
          </div>

          <div className={styles.grid}>
            <section className={styles.card}>
              <h2>Get Started</h2>
              <p>Calculator and compliance tools coming soon!</p>
              <p style={{ marginTop: '16px', color: 'var(--muted)' }}>We're building real-time features for you. Check back soon.</p>
            </section>

            <section className={styles.card}>
              <h2>Your Plan</h2>
              <p><strong>Free</strong> - Always free</p>
              <ul style={{ marginTop: '16px', listStyle: 'none' }}>
                <li>✓ Single-policy calculator</li>
                <li>✓ All 50 states</li>
              </ul>
              <Link href="/" className="btn" style={{ marginTop: '16px', display: 'inline-block' }}>
                View Pricing
              </Link>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
