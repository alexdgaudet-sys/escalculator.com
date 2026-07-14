import Link from 'next/link'
import styles from '../styles/Dashboard.module.css'

export default function Dashboard() {
  // In real app, fetch user data from Supabase and check if authenticated
  // If not authenticated, redirect to /login

  const user = {
    name: 'Jane Doe',
    email: 'jane@agency.com',
    company: 'Midwest Insurance',
    plan: 'pro',
  }

  const recentCalculations = [
    { id: 1, insured: 'Acme Corp', state: 'TX', premium: 250000, tax: 12125, date: '2026-01-15' },
    { id: 2, insured: 'Global Industries', state: 'FL', premium: 85000, tax: 4199, date: '2026-01-14' },
    { id: 3, insured: 'Tech Ventures LLC', state: 'NY', premium: 1200000, tax: 45334, date: '2026-01-13' },
  ]

  return (
    <div className={styles.page}>
      {/* Navigation */}
      <nav className={styles.nav}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px' }}>
          <div className={styles.logo}>Surplus Lines Tax</div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span className={styles.userEmail}>{user.email}</span>
            <button className={styles.logoutBtn}>Sign out</button>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarContent}>
          <div className={styles.sidebarSection}>
            <h3>Tools</h3>
            <Link href="/app/calculator" className={styles.sidebarLink + ' ' + styles.active}>
              Calculator
            </Link>
            <Link href="/app/batch" className={styles.sidebarLink}>
              Batch upload
            </Link>
            <Link href="/app/sde" className={styles.sidebarLink}>
              Compliance forms
            </Link>
            <Link href="/app/history" className={styles.sidebarLink}>
              History
            </Link>
          </div>

          <div className={styles.sidebarSection}>
            <h3>Account</h3>
            <Link href="/app/settings" className={styles.sidebarLink}>
              Settings
            </Link>
            <Link href="/app/billing" className={styles.sidebarLink}>
              Billing & plan
            </Link>
            <Link href="/app/team" className={styles.sidebarLink}>
              Team members
            </Link>
          </div>

          <div className={styles.sidebarSection}>
            <h3>Help</h3>
            <a href="https://docs.surpluslinestax.com" className={styles.sidebarLink}>
              Documentation
            </a>
            <a href="mailto:support@surpluslinestax.com" className={styles.sidebarLink}>
              Contact support
            </a>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className={styles.main}>
        <div className="container">
          {/* Welcome */}
          <div className={styles.welcome}>
            <div>
              <h1>Welcome back, {user.name.split(' ')[0]}</h1>
              <p>You're on the <strong>{user.plan.charAt(0).toUpperCase() + user.plan.slice(1)} plan</strong> at {user.company}</p>
            </div>
            <Link href="/app/calculator" className="btn">
              + New calculation
            </Link>
          </div>

          {/* Grid */}
          <div className={styles.grid}>
            {/* Quick actions */}
            <section className={styles.card}>
              <h2>Quick actions</h2>
              <div className={styles.actionGrid}>
                <Link href="/app/calculator" className={styles.action}>
                  <div className={styles.actionIcon}>🧮</div>
                  <div>
                    <strong>Tax calculator</strong>
                    <p>Single policy</p>
                  </div>
                </Link>
                <Link href="/app/batch" className={styles.action}>
                  <div className={styles.actionIcon}>📤</div>
                  <div>
                    <strong>Batch upload</strong>
                    <p>100+ policies</p>
                  </div>
                </Link>
                <Link href="/app/sde" className={styles.action}>
                  <div className={styles.actionIcon}>✍️</div>
                  <div>
                    <strong>SDE forms</strong>
                    <p>Compliance</p>
                  </div>
                </Link>
              </div>
            </section>

            {/* Recent */}
            <section className={styles.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Recent calculations</h2>
                <Link href="/app/history" className={styles.moreLink}>View all</Link>
              </div>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Insured</th>
                    <th>State</th>
                    <th>Premium</th>
                    <th>Tax & fees</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentCalculations.map(calc => (
                    <tr key={calc.id}>
                      <td><strong>{calc.insured}</strong></td>
                      <td><code>{calc.state}</code></td>
                      <td>${(calc.premium / 1000).toFixed(0)}k</td>
                      <td>${(calc.tax).toLocaleString('en-US', { minimumFractionDigits: 0 })}</td>
                      <td style={{ fontSize: '13px', color: 'var(--muted)' }}>{calc.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            {/* Stats */}
            <section className={styles.card}>
              <h2>This month</h2>
              <div className={styles.statsGrid}>
                <div className={styles.stat}>
                  <div className={styles.statValue}>24</div>
                  <div className={styles.statLabel}>Calculations</div>
                </div>
                <div className={styles.stat}>
                  <div className={styles.statValue}>$2.4M</div>
                  <div className={styles.statLabel}>Total premium</div>
                </div>
                <div className={styles.stat}>
                  <div className={styles.statValue}>$98.5k</div>
                  <div className={styles.statLabel}>Total tax & fees</div>
                </div>
              </div>
            </section>

            {/* Plan info */}
            {user.plan === 'free' && (
              <section className={styles.card} style={{ borderLeft: '4px solid var(--teal)' }}>
                <h2>Upgrade to Pro</h2>
                <p>Unlock batch upload, save history, and compliance forms.</p>
                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  <Link href="/app/billing" className="btn">See plans</Link>
                  <button className="btn secondary" disabled>
                    Contact sales
                  </button>
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
