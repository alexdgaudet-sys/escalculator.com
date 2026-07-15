import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const stateRates = {
  'AL': { tax: 0.05, fee: 0 },
  'AK': { tax: 0.05, fee: 0 },
  'AZ': { tax: 0.06, fee: 0 },
  'AR': { tax: 0.06, fee: 0 },
  'CA': { tax: 0.07, fee: 0 },
  'CO': { tax: 0.10, fee: 0 },
  'CT': { tax: 0.03, fee: 0 },
  'DE': { tax: 0.05, fee: 0 },
  'DC': { tax: 0.05, fee: 0 },
  'FL': { tax: 0.06, fee: 0 },
  'GA': { tax: 0.08, fee: 0 },
  'HI': { tax: 0.05, fee: 0 },
  'ID': { tax: 0.04, fee: 0 },
  'IL': { tax: 0.25, fee: 0 },
  'IN': { tax: 0.08, fee: 0 },
  'IA': { tax: 0.05, fee: 0 },
  'KS': { tax: 0.06, fee: 0 },
  'KY': { tax: 0.06, fee: 0 },
  'LA': { tax: 0.04, fee: 0 },
  'ME': { tax: 0.04, fee: 0 },
  'MD': { tax: 0.08, fee: 0 },
  'MA': { tax: 0.06, fee: 0 },
  'MI': { tax: 0.05, fee: 0 },
  'MN': { tax: 0.08, fee: 0 },
  'MS': { tax: 0.04, fee: 0 },
  'MO': { tax: 0.06, fee: 0 },
  'MT': { tax: 0.05, fee: 0 },
  'NE': { tax: 0.05, fee: 0 },
  'NV': { tax: 0.08, fee: 0 },
  'NH': { tax: 0.05, fee: 0 },
  'NJ': { tax: 0.06, fee: 0 },
  'NM': { tax: 0.05, fee: 0 },
  'NY': { tax: 0.06, fee: 0 },
  'NC': { tax: 0.06, fee: 0 },
  'ND': { tax: 0.04, fee: 0 },
  'OH': { tax: 0.05, fee: 0 },
  'OK': { tax: 0.06, fee: 0 },
  'OR': { tax: 0.06, fee: 0 },
  'PA': { tax: 0.05, fee: 0 },
  'RI': { tax: 0.06, fee: 0 },
  'SC': { tax: 0.06, fee: 0 },
  'SD': { tax: 0.04, fee: 0 },
  'TN': { tax: 0.06, fee: 0 },
  'TX': { tax: 0.06, fee: 0 },
  'UT': { tax: 0.05, fee: 0 },
  'VT': { tax: 0.06, fee: 0 },
  'VA': { tax: 0.04, fee: 0 },
  'WA': { tax: 0.07, fee: 0 },
  'WV': { tax: 0.05, fee: 0 },
  'WI': { tax: 0.05, fee: 0 },
  'WY': { tax: 0.04, fee: 0 },
}

export default function Calculator() {
  const [state, setState] = useState('TX')
  const [premium, setPremium] = useState('')
  const [insured, setInsured] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleCalculate = async (e) => {
    e.preventDefault()
    
    if (!premium || !state) {
      alert('Please enter premium and select state')
      return
    }

    const premiumAmount = parseFloat(premium)
    const rates = stateRates[state] || { tax: 0, fee: 0 }
    const taxAmount = premiumAmount * rates.tax
    const totalAmount = premiumAmount + taxAmount + (rates.fee || 0)

    const calculation = {
      state,
      insured: insured || 'Unnamed',
      premium: premiumAmount,
      tax: taxAmount,
      fee: rates.fee || 0,
      total: totalAmount,
      timestamp: new Date().toISOString(),
    }

    setResult(calculation)

    // Save to Supabase
    setLoading(true)
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
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ marginBottom: '20px', fontFamily: 'Georgia, serif' }}>Surplus Lines Tax Calculator</h2>

      <form onSubmit={handleCalculate} style={{ marginBottom: '30px' }}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase' }}>
            Insured Name (Optional)
          </label>
          <input
            type="text"
            value={insured}
            onChange={(e) => setInsured(e.target.value)}
            placeholder="ABC Corporation"
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase' }}>
            State *
          </label>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
          >
            {Object.keys(stateRates).map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase' }}>
            Premium Amount *
          </label>
          <input
            type="number"
            value={premium}
            onChange={(e) => setPremium(e.target.value)}
            placeholder="0.00"
            step="0.01"
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            background: '#0E6E5C',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          {loading ? 'Calculating...' : 'Calculate Tax'}
        </button>
      </form>

      {result && (
        <div style={{ background: '#F3F5F0', padding: '20px', borderRadius: '6px', border: '1px solid #CBD4C7' }}>
          <h3 style={{ marginBottom: '16px', fontFamily: 'Georgia, serif' }}>Result</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ padding: '8px 0', borderBottom: '1px solid #DEE5DA' }}>Insured:</td>
                <td style={{ padding: '8px 0', borderBottom: '1px solid #DEE5DA', textAlign: 'right', fontWeight: 'bold' }}>{result.insured}</td>
              </tr>
              <tr>
                <td style={{ padding: '8px 0', borderBottom: '1px solid #DEE5DA' }}>State:</td>
                <td style={{ padding: '8px 0', borderBottom: '1px solid #DEE5DA', textAlign: 'right', fontWeight: 'bold' }}>{result.state}</td>
              </tr>
              <tr>
                <td style={{ padding: '8px 0', borderBottom: '1px solid #DEE5DA' }}>Premium:</td>
                <td style={{ padding: '8px 0', borderBottom: '1px solid #DEE5DA', textAlign: 'right' }}>${result.premium.toFixed(2)}</td>
              </tr>
              <tr>
                <td style={{ padding: '8px 0', borderBottom: '1px solid #DEE5DA' }}>Tax:</td>
                <td style={{ padding: '8px 0', borderBottom: '1px solid #DEE5DA', textAlign: 'right' }}>${result.tax.toFixed(2)}</td>
              </tr>
              <tr>
                <td style={{ padding: '8px 0', borderBottom: '1px solid #DEE5DA' }}>Fees:</td>
                <td style={{ padding: '8px 0', borderBottom: '1px solid #DEE5DA', textAlign: 'right' }}>${result.fee.toFixed(2)}</td>
              </tr>
              <tr style={{ borderTop: '2px solid #1C2721' }}>
                <td style={{ padding: '12px 0', fontWeight: 'bold', fontSize: '16px' }}>Total:</td>
                <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: 'bold', fontSize: '16px' }}>${result.total.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
