import Link from 'next/link'
import styles from '../styles/Landing.module.css'

export default function Landing() {
  return (
    <div className={styles.page}>
      {/* Navigation */}
      <nav className={styles.nav}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px' }}>
          <div className={styles.logo}>Surplus Lines Tax</div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <Link href="/login" className={styles.navLink}>Sign in</Link>
            <Link href="/login" className="btn">Get started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.eyebrow}>Excess & Surplus Lines · All 50 States</div>
            <h1 className={styles.h1}>
              Tax calculation and compliance,
              <span className={styles.highlight}> figured right</span>
            </h1>
            <p className={styles.subtitle}>
              Calculate surplus lines tax for every placement. Generate state-specific compliance forms. Export results in seconds. Used by brokers, MGAs, and wholesalers placing policies in all 50 states and DC.
            </p>
            <div className={styles.ctaGroup}>
              <Link href="/login" className="btn">Start free trial</Link>
              <a href="#pricing" className="btn secondary">View pricing</a>
            </div>
            <p className={styles.subtext}>Free tier includes single-policy calculator. No credit card required.</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className={styles.features}>
        <div className="container">
          <h2 className={styles.sectionTitle}>What you get</h2>
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🧮</div>
              <h3>Tax Calculator</h3>
              <p>Instant surplus lines tax, stamping fees, and filing charges for all 50 states. Rates updated quarterly. All calculations include state-specific fee treatment.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📤</div>
              <h3>Batch Upload</h3>
              <p>Upload Excel or CSV with your policy list. Calculate tax for 100+ placements at once. Export results with full breakdown per policy.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>✍️</div>
              <h3>Compliance Forms</h3>
              <p>Generate state-specific Statement of Diligent Effort forms. Track carrier declinations. Download as PDF or print directly.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📊</div>
              <h3>Save & Compare</h3>
              <p>Save calculations to your account. Compare scenarios. Build a searchable history of all placements.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>⚙️</div>
              <h3>Editable Rates</h3>
              <p>Override any rate with your stamping office's current published fees. Changes apply instantly across all calculations.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🔄</div>
              <h3>Rate Updates</h3>
              <p>We update rates quarterly and notify you when changes affect your states. Stay compliant without manual tracking.</p>
            </div>
          </div>
        </div>
      </section>

      {/* States Coverage */}
      <section className={styles.coverage}>
        <div className="container">
          <div className={styles.coverageContent}>
            <h2>Complete coverage</h2>
            <p>All 50 states plus DC. Every state has unique tax rates, stamping fees, and compliance requirements. We handle them all.</p>
            <div className={styles.statesGrid}>
              {['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME'].map(s => (
                <div key={s} className={styles.stateTag}>{s}</div>
              ))}
            </div>
            <p style={{ marginTop: '12px', color: 'var(--muted)', fontSize: '13px' }}>… and 31 more states included</p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className={styles.pricing} id="pricing">
        <div className="container">
          <h2 className={styles.sectionTitle}>Simple pricing</h2>
          <div className={styles.priceGrid}>
            <div className={styles.priceCard}>
              <div className={styles.priceBadge}>Free</div>
              <div className={styles.priceAmount}>$0</div>
              <p className={styles.pricePeriod}>Forever</p>
              <ul className={styles.priceFeatures}>
                <li>✓ Single-policy calculator</li>
                <li>✓ All 50 states + DC</li>
                <li>✓ View results online</li>
                <li>✗ Batch upload</li>
                <li>✗ Save history</li>
                <li>✗ Export results</li>
              </ul>
              <button className="btn secondary" disabled style={{ width: '100%' }}>Current plan</button>
            </div>

            <div className={styles.priceCard + ' ' + styles.recommended}>
              <div className={styles.priceBadge} style={{ background: 'var(--stamp)' }}>Most popular</div>
              <div className={styles.priceAmount}>$49</div>
              <p className={styles.pricePeriod}>per month, billed monthly</p>
              <ul className={styles.priceFeatures}>
                <li>✓ Single-policy calculator</li>
                <li>✓ All 50 states + DC</li>
                <li>✓ Batch upload (unlimited)</li>
                <li>✓ Save & search history</li>
                <li>✓ Export Excel + PDF</li>
                <li>✓ SDE form generation</li>
              </ul>
              <Link href="/login" className="btn" style={{ width: '100%', justifyContent: 'center' }}>Start free trial</Link>
            </div>

            <div className={styles.priceCard}>
              <div className={styles.priceBadge}>Enterprise</div>
              <div className={styles.priceAmount}>Custom</div>
              <p className={styles.pricePeriod}>per year, volume pricing</p>
              <ul className={styles.priceFeatures}>
                <li>✓ Everything in Pro</li>
                <li>✓ Team accounts (5+ users)</li>
                <li>✓ API access</li>
                <li>✓ AMS integrations</li>
                <li>✓ Priority support</li>
                <li>✓ Custom compliance exports</li>
              </ul>
              <a href="mailto:sales@surpluslinestax.com" className="btn secondary" style={{ width: '100%', justifyContent: 'center', marginTop: 0 }}>Contact sales</a>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className={styles.comparison}>
        <div className="container">
          <h2 className={styles.sectionTitle}>How we compare</h2>
          <table className={styles.comparisonTable}>
            <thead>
              <tr>
                <th>Feature</th>
                <th>Surplus Lines Tax</th>
                <th>Competitor A</th>
                <th>Competitor B</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Tax calculation all 50 states</td>
                <td className={styles.checkmark}>✓</td>
                <td className={styles.checkmark}>✓</td>
                <td className={styles.checkmark}>✓</td>
              </tr>
              <tr>
                <td>Batch upload policies</td>
                <td className={styles.checkmark}>✓</td>
                <td className={styles.checkmark}>✓</td>
                <td>✗</td>
              </tr>
              <tr>
                <td>SDE form generation</td>
                <td className={styles.checkmark}>✓</td>
                <td>✗</td>
                <td>✗</td>
              </tr>
              <tr>
                <td>Editable rates</td>
                <td className={styles.checkmark}>✓</td>
                <td className={styles.checkmark}>✓</td>
                <td className={styles.checkmark}>✓</td>
              </tr>
              <tr>
                <td>Quarterly rate updates</td>
                <td className={styles.checkmark}>✓</td>
                <td>✗</td>
                <td className={styles.checkmark}>✓</td>
              </tr>
              <tr>
                <td>Free tier available</td>
                <td className={styles.checkmark}>✓</td>
                <td>✗</td>
                <td>✗</td>
              </tr>
              <tr>
                <td>Starter price</td>
                <td className={styles.checkmark}>$49/mo</td>
                <td>$99/mo</td>
                <td>$150/mo</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.faq}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Questions?</h2>
          <div className={styles.faqGrid}>
            <div className={styles.faqItem}>
              <h4>What states require a diligent effort?</h4>
              <p>Nearly all states require brokers to make a good-faith effort to place coverage in the admitted market before surplus lines. Four states (LA, MS, VA, WI) have abolished the requirement. 17 states have export lists for specific coverages.</p>
            </div>
            <div className={styles.faqItem}>
              <h4>How often are tax rates updated?</h4>
              <p>We update rates quarterly (Jan, Apr, Jul, Oct) as states change them. You'll receive a notification when rates for your states change, and you can update rates manually anytime.</p>
            </div>
            <div className={styles.faqItem}>
              <h4>Can I try it free?</h4>
              <p>Yes. Sign up free and calculate taxes for single policies. To batch upload, generate SDE forms, and save history, upgrade to Pro ($49/mo). You get 14 days free trial on Pro before payment.</p>
            </div>
            <div className={styles.faqItem}>
              <h4>Does it integrate with my AMS?</h4>
              <p>For MVP, no. We support manual upload and export. Enterprise tier includes API access and custom integrations. Contact sales if you need direct AMS integration.</p>
            </div>
            <div className={styles.faqItem}>
              <h4>Is this a legal advisory tool?</h4>
              <p>No. This is a calculation and form-generation tool. Always consult your stamping office or state department of insurance for compliance questions. Rates and requirements change; verify before filing.</p>
            </div>
            <div className={styles.faqItem}>
              <h4>What if a rate is wrong?</h4>
              <p>Email support@surpluslinestax.com with the state and the correct rate. We verify and update within 24 hours. Pro customers can override any rate immediately and see the change reflected in all calculations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.finalCta}>
        <div className="container">
          <h2>Ready to simplify surplus lines compliance?</h2>
          <p>Start free. Upgrade anytime. No credit card required to start.</p>
          <Link href="/login" className="btn" style={{ fontSize: '16px', padding: '12px 32px' }}>Get started free</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '32px' }}>
            <div>
              <div className={styles.footerBrand}>Surplus Lines Tax</div>
              <p style={{ maxWidth: '300px', marginTop: '8px' }}>Tax calculation and compliance forms for excess & surplus lines insurance across all 50 states.</p>
            </div>
            <div>
              <h4 style={{ marginBottom: '8px' }}>Product</h4>
              <ul style={{ listStyle: 'none' }}>
                <li><Link href="#pricing">Pricing</Link></li>
                <li><a href="/docs">Documentation</a></li>
                <li><a href="mailto:support@surpluslinestax.com">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ marginBottom: '8px' }}>Company</h4>
              <ul style={{ listStyle: 'none' }}>
                <li><a href="/terms">Terms of service</a></li>
                <li><a href="/privacy">Privacy policy</a></li>
                <li><a href="mailto:hello@surpluslinestax.com">Contact</a></li>
              </ul>
            </div>
          </div>
          <div style={{ borderTop: '1px solid var(--rule)', marginTop: '32px', paddingTop: '16px', textAlign: 'center', color: 'var(--muted)', fontSize: '13px' }}>
            <p>© 2026 Surplus Lines Tax Calculator. All rights reserved. Not affiliated with state departments of insurance or stamping offices.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
