import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Reports() {
  const [calculations, setCalculations] = useState([])
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState(null)
  const [byState, setByState] = useState([])

  useEffect(() => {
    fetchCalculations()
  }, [])

  const fetchCalculations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('calculations')
        .select('*')
        .eq('user_id', user.id)

      if (error) throw error
      
      setCalculations(data || [])
      calculateSummary(data || [])
    } catch (err) {
      console.error('Error fetching calculations:', err)
    } finally {
      setLoading(false)
    }
  }

  const calculateSummary = (data) => {
    const totalPremium = data.reduce((sum, c) => sum + parseFloat(c.premium), 0)
    const totalTax = data.reduce((sum, c) => sum + parseFloat(c.tax_amount), 0)
    const count = data.length

    setSummary({
      totalPremium,
      totalTax,
      count,
      averagePremium: count > 0 ? totalPremium / count : 0,
    })

    // Calculate by state
    const stateMap = {}
    data.forEach(calc => {
      if (!stateMap[calc.state]) {
        stateMap[calc.state] = {
          state: calc.state,
          count: 0,
          premium: 0,
          tax: 0,
        }
      }
      stateMap[calc.state].count += 1
      stateMap[calc.state].premium += parseFloat(calc.premium)
      stateMap[calc.state].tax += parseFloat(calc.tax_amount)
    })

    const stateArray = Object.values(stateMap).sort((a, b) => b.premium - a.premium)
    setByState(stateArray)
  }

  const exportToPDF = () => {
    const html = `
      <html>
        <head>
          <title>Calculation Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #0E6E5C; border-bottom: 2px solid #0E6E5C; padding-bottom: 10px; }
            h2 { color: #0E6E5C; margin-top: 30px; }
            .summary { display: flex; gap: 40px; margin: 20px 0; }
            .card { padding: 15px; background: #f0f0f0; border-radius: 5px; min-width: 150px; }
            .card-value { font-size: 24px; font-weight: bold; color: #0E6E5C; }
            .card-label { font-size: 12px; color: #666; text-transform: uppercase; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th { background: #0E6E5C; color: white; padding: 10px; text-align: left; }
            td { padding: 8px; border-bottom: 1px solid #ddd; }
            tr:hover { background: #f5f5f5; }
            .footer { margin-top: 40px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <h1>E&S Calculator Report</h1>
          <p>Generated: ${new Date().toLocaleDateString()} | Total Calculations: ${calculations.length}</p>
          
          <h2>Summary</h2>
          <div class="summary">
            <div class="card">
              <div class="card-label">Total Premium</div>
              <div class="card-value">$${summary.totalPremium.toFixed(2)}</div>
            </div>
            <div class="card">
              <div class="card-label">Total Tax</div>
              <div class="card-value">$${summary.totalTax.toFixed(2)}</div>
            </div>
            <div class="card">
              <div class="card-label">Total Policies</div>
              <div class="card-value">${summary.count}</div>
            </div>
            <div class="card">
              <div class="card-label">Avg Premium</div>
              <div class="card-value">$${summary.averagePremium.toFixed(2)}</div>
            </div>
          </div>

          <h2>By State Breakdown</h2>
          <table>
            <thead>
              <tr>
                <th>State</th>
                <th>Policies</th>
                <th>Total Premium</th>
                <th>Total Tax</th>
              </tr>
            </thead>
            <tbody>
              ${byState.map(s => `
                <tr>
                  <td><strong>${s.state}</strong></td>
                  <td>${s.count}</td>
                  <td>$${s.premium.toFixed(2)}</td>
                  <td>$${s.tax.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="footer">
            <p>E&S Calculator | www.escalculator.com</p>
          </div>
        </body>
      </html>
    `

    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js'
    document.head.appendChild(script)
    
    script.onload = () => {
      const opt = {
        margin: 10,
        filename: 'calculation-report.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
      }
      html2pdf().set(opt).from(html).save()
    }
  }

  if (loading) {
    return <p style={{ color: 'var(--muted)' }}>Loading reports...</p>
  }

  if (!summary || summary.count === 0) {
    return (
      <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '20px' }}>
        No calculations yet. Create some calculations to see reports!
      </p>
    )
  }

  return (
    <div style={{ marginTop: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ marginBottom: '0', fontFamily: 'Georgia, serif', fontSize: '20px' }}>
          Reports
        </h3>
        <button
          onClick={exportToPDF}
          style={{
            padding: '8px 16px',
            background: 'var(--teal)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold',
          }}
        >
          📄 Export Report
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '30px' }}>
        <div style={{ background: 'var(--teal-soft)', padding: '20px', borderRadius: '6px', border: '1px solid var(--rule)' }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '8px' }}>Total Premium</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--teal)' }}>${summary.totalPremium.toFixed(2)}</div>
        </div>

        <div style={{ background: 'var(--teal-soft)', padding: '20px', borderRadius: '6px', border: '1px solid var(--rule)' }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '8px' }}>Total Tax</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--teal)' }}>${summary.totalTax.toFixed(2)}</div>
        </div>

        <div style={{ background: 'var(--teal-soft)', padding: '20px', borderRadius: '6px', border: '1px solid var(--rule)' }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '8px' }}>Total Policies</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--teal)' }}>{summary.count}</div>
        </div>

        <div style={{ background: 'var(--teal-soft)', padding: '20px', borderRadius: '6px', border: '1px solid var(--rule)' }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '8px' }}>Avg Premium</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--teal)' }}>${summary.averagePremium.toFixed(2)}</div>
        </div>
      </div>

      {/* By State Table */}
      <div style={{ marginTop: '30px' }}>
        <h4 style={{ fontFamily: 'Georgia, serif', marginBottom: '16px' }}>Breakdown by State</h4>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--rule)', background: 'var(--teal-soft)' }}>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>State</th>
              <th style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold' }}>Policies</th>
              <th style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>Premium</th>
              <th style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>Tax</th>
              <th style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>Effective Rate</th>
            </tr>
          </thead>
          <tbody>
            {byState.map((state, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid var(--rule-soft)' }}>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>{state.state}</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>{state.count}</td>
                <td style={{ padding: '12px', textAlign: 'right' }}>${state.premium.toFixed(2)}</td>
                <td style={{ padding: '12px', textAlign: 'right', color: 'var(--teal)', fontWeight: 'bold' }}>${state.tax.toFixed(2)}</td>
                <td style={{ padding: '12px', textAlign: 'right', fontSize: '12px', color: 'var(--muted)' }}>
                  {((state.tax / state.premium) * 100).toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
