import styles from '../styles/Dashboard.module.css'
import TaxCalculator from '../components/TaxCalculator'
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
    plan: 'free',
  }

  return (
    <div className={styles.page}>
      {/* Navigation */}
      <nav className={styles.nav}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px' }}>
          <div className={styles.logo}>E&S Calculator</div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span className={styles.userEmail}>{user.email}</span>
            <button 
              className={styles.logoutBtn}
              onClick={handleLogout}
              style={{ cursor: 'pointer' }}
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className={styles.main}>
        <div className="container">
          {/* Welcome Section */}
          <div className={styles.welcome}>
            <div>
              <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Welcome back!</h1>
              <p style={{ fontSize: '16px', color: 'var(--muted)' }}>You're on the <strong>Free plan</strong>. Upgrade to Pro to unlock batch upload and compliance forms.</p>
            </div>
            <Link href="/#pricing" className="btn" style={{ whiteSpace: 'nowrap' }}>
              View Pricing
            </Link>
          </div>

          {/* Grid */}
          <div className={styles.grid}>
            {/* Calculator */}
<section className={styles.card} style={{ gridColumn: '1 / -1' }}>
  <TaxCalculator />
</section>
            {/* Quick Start */}
            <section className={styles.card}>
              <h2>Getting Started</h2>
              <p style={{ color: 'var(--muted)', marginBottom: '20px' }}>Your calculator and compliance tools are coming soon. We're building real-time features for your workflow.</p>
              <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
                <Link href="/" className="btn secondary">
                  ← Back to Home
                </Link>
                <a href="mailto:support@surpluslinestax.com" className="btn secondary">
                  Contact Support
                </a>
              </div>
            </section>

            {/* Your Plan */}
            <section className={styles.card}>
              <h2>Your Plan</h2>
              <div style={{ 
                background: 'var(--teal-soft)',
                padding: '16px',
                borderRadius: '6px',
                marginBottom: '16px',
                borderLeft: '3px solid var(--teal)'
              }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--teal)', marginBottom: '4px' }}>Free</div>
                <div style={{ color: 'var(--muted)', fontSize: '14px' }}>$0/month • Always free</div>
              </div>
              <ul style={{ listStyle: 'none', marginBottom: '20px' }}>
                <li style={{ padding: '8px 0', borderBottom: '1px solid var(--rule-soft)' }}>✓ Single-policy calculator</li>
                <li style={{ padding: '8px 0', borderBottom: '1px solid var(--rule-soft)' }}>✓ All 50 states + DC</li>
                <li style={{ padding: '8px 0' }}>✓ View results online</li>
              </ul>
              <Link href="/#pricing" className="btn">
                Upgrade to Pro
              </Link>
            </section>

            {/* Pro Features */}
            <section className={styles.card} style={{ borderLeft: '4px solid var(--stamp)' }}>
              <h2>Ready to Level Up?</h2>
              <p style={{ color: 'var(--muted)', marginBottom: '16px' }}>Unlock powerful features with Pro:</p>
              <ul style={{ listStyle: 'none', marginBottom: '20px' }}>
                <li style={{ padding: '8px 0' }}>⚡ Batch upload (100+ policies)</li>
                <li style={{ padding: '8px 0' }}>📊 Save & search history</li>
                <li style={{ padding: '8px 0' }}>📄 SDE form generation</li>
                <li style={{ padding: '8px 0' }}>📥 Export Excel + PDF</li>
              </ul>
              <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>$49<span style={{ fontSize: '16px', fontWeight: 'normal', color: 'var(--muted)' }}>/month</span></div>
              <Link href="/#pricing" className="btn">
                Start Free Trial
              </Link>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
