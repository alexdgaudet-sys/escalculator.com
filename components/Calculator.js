import { useState } from 'react'
import { useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

const stateRates = {
  'AL': 0.05, 'AK': 0.05, 'AZ': 0.06, 'AR': 0.06, 'CA': 0.07, 'CO': 0.10,
  'CT': 0.03, 'DE': 0.05, 'DC': 0.05, 'FL': 0.06, 'GA': 0.08, 'HI': 0.05,
  'ID': 0.04, 'IL': 0.25, 'IN': 0.08, 'IA': 0.05, 'KS': 0.06, 'KY': 0.06,
  'LA': 0.04, 'ME': 0.04, 'MD': 0.08, 'MA': 0.06, 'MI': 0.05, 'MN': 0.08,
  'MS': 0.04, 'MO': 0.06, 'MT': 0.05, 'NE': 0.05, 'NV': 0.08, 'NH': 0.05,
  'NJ': 0.06, 'NM': 0.05, 'NY': 0.06, 'NC': 0.06, 'ND': 0.04, 'OH': 0.05,
  'OK': 0.06, 'OR': 0.06, 'PA': 0.05, 'RI': 0.06, 'SC': 0.06, 'SD': 0.04,
  'TN': 0.06, 'TX': 0.06, 'UT': 0.05, 'VT': 0.06, 'VA': 0.04, 'WA': 0.07,
  'WV': 0.05, 'WI': 0.05, 'WY': 0.04,
}

export default function TaxCalculator() {
  const [policyNumber, setPolicyNumber] = useState('')
  const [policyholderName, setPolicyholderName] = useState('')
  const [effectiveDate, setEffectiveDate] = useState('')
  const [state, setState] = useState('TX')
  const [premium, setPremium] = useState('100000')
  const [result, setResult] = useState(null)

  const handleCalculate = () => {
    // Save to Supabase
const saveToDatabase = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      await supabase.from('calculations').insert([
        {
          user_id: user.id,
          state,
          premium: premiumAmount,
          fees: rates.fee || 0,
          tax_amount: taxAmount,
          total_amount: totalAmount,
        }
      ])
    }
  } catch (err) {
    console.error('Error saving calculation:', err)
  }
}

saveToDatabase()
    if (!premium || !state) return

    const premiumAmount = parseFloat(premium)
    const taxRate = stateRates[state] || 0.05
    const taxAmount = premiumAmount * taxRate
    const totalAmount = premiumAmount + taxAmount

    setResult({
      policyNumber,
      policyholderName,
      effectiveDate,
      state,
      premium: premiumAmount,
      taxRate,
      tax: taxAmount,
      total: totalAmount,
    })
  }

  return (
    <div style={{ width: '100%', maxWidth: '100%', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ marginBottom: '20px', fontFamily: 'Georgia, serif', fontSize: '24px' }}>
        Surplus Lines Tax Calculator
      </h2>

      <div style={{ background: 'var(--card)', padding: '20px', borderRadius: '6px', border: '1px solid var(--rule)', marginBottom: '20px' }}>
        {/* Policy Information */}
        <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid var(--rule-soft)' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--muted)' }}>
            Policy Information
          </h3>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)' }}>
              Policyholder Name
            </label>
            <input
              type="text"
              value={policyholderName}
              onChange={(e) => setPolicyholderName(e.target.value)}
              placeholder="ABC Corporation"
              style={{ width: '100%', padding: '10px', border: '1px solid var(--rule)', borderRadius: '4px', fontSize: '15px' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)' }}>
              Policy Number
            </label>
            <input
              type="text"
              value={policyNumber}
              onChange={(e) => setPolicyNumber(e.target.value)}
              placeholder="POL-2026-001"
              style={{ width: '100%', padding: '10px', border: '1px solid var(--rule)', borderRadius: '4px', fontSize: '15px' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)' }}>
              Effective Date
            </label>
            <input
              type="date"
              value={effectiveDate}
              onChange={(e) => setEffectiveDate(e.target.value)}
              style={{ width: '100%', padding: '10px', border: '1px solid var(--rule)', borderRadius: '4px', fontSize: '15px' }}
            />
          </div>
        </div>

        {/* Premium & State */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--muted)' }}>
            Coverage Information
          </h3>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)' }}>
              State *
            </label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              style={{ width: '100%', padding: '10px', border: '1px solid var(--rule)', borderRadius: '4px', fontSize: '15px' }}
            >
              {Object.keys(stateRates).sort().map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)' }}>
              Premium Amount *
            </label>
            <input
              type="number"
              value={premium}
              onChange={(e) => setPremium(e.target.value)}
              placeholder="0.00"
              step="0.01"
              style={{ width: '100%', padding: '10px', border: '1px solid var(--rule)', borderRadius: '4px', fontSize: '15px' }}
            />
          </div>
        </div>

        <button
          onClick={handleCalculate}
          style={{
            width: '100%',
            padding: '12px',
            background: 'var(--teal)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '15px',
          }}
        >
          Calculate Tax
        </button>
      </div>

      {result && (
        <div style={{ background: 'var(--teal-soft)', padding: '20px', borderRadius: '6px', border: '1px solid var(--rule)' }}>
          <h3 style={{ marginBottom: '16px', fontFamily: 'Georgia, serif' }}>Calculation Results</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
            <tbody>
              {result.policyholderName && (
                <tr>
                  <td style={{ padding: '8px 0', borderBottom: '1px solid var(--rule-soft)' }}>Policyholder:</td>
                  <td style={{ padding: '8px 0', borderBottom: '1px solid var(--rule-soft)', textAlign: 'right', fontWeight: 'bold' }}>{result.policyholderName}</td>
                </tr>
              )}
              {result.policyNumber && (
                <tr>
                  <td style={{ padding: '8px 0', borderBottom: '1px solid var(--rule-soft)' }}>Policy Number:</td>
                  <td style={{ padding: '8px 0', borderBottom: '1px solid var(--rule-soft)', textAlign: 'right', fontWeight: 'bold' }}>{result.policyNumber}</td>
                </tr>
              )}
              {result.effectiveDate && (
                <tr>
                  <td style={{ padding: '8px 0', borderBottom: '1px solid var(--rule-soft)' }}>Effective Date:</td>
                  <td style={{ padding: '8px 0', borderBottom: '1px solid var(--rule-soft)', textAlign: 'right' }}>{result.effectiveDate}</td>
                </tr>
              )}
              <tr>
                <td style={{ padding: '8px 0', borderBottom: '1px solid var(--rule-soft)' }}>State:</td>
                <td style={{ padding: '8px 0', borderBottom: '1px solid var(--rule-soft)', textAlign: 'right', fontWeight: 'bold' }}>{result.state}</td>
              </tr>
              <tr>
                <td style={{ padding: '8px 0', borderBottom: '1px solid var(--rule-soft)' }}>Premium:</td>
                <td style={{ padding: '8px 0', borderBottom: '1px solid var(--rule-soft)', textAlign: 'right' }}>${result.premium.toFixed(2)}</td>
              </tr>
              <tr>
                <td style={{ padding: '8px 0', borderBottom: '1px solid var(--rule-soft)' }}>Tax Rate:</td>
                <td style={{ padding: '8px 0', borderBottom: '1px solid var(--rule-soft)', textAlign: 'right' }}>{(result.taxRate * 100).toFixed(1)}%</td>
              </tr>
              <tr>
                <td style={{ padding: '8px 0', borderBottom: '1px solid var(--rule-soft)' }}>Tax Amount:</td>
                <td style={{ padding: '8px 0', borderBottom: '1px solid var(--rule-soft)', textAlign: 'right', fontWeight: 'bold', color: 'var(--teal)' }}>${result.tax.toFixed(2)}</td>
              </tr>
              <tr>
                <td style={{ padding: '12px 0', fontSize: '16px', fontWeight: 'bold' }}>Total:</td>
                <td style={{ padding: '12px 0', textAlign: 'right', fontSize: '16px', fontWeight: 'bold', color: 'var(--teal)' }}>${result.total.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
