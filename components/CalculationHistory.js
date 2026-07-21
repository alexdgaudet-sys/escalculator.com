import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function CalculationHistory() {
  const [calculations, setCalculations] = useState([])
  const [loading, setLoading] = useState(true)

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
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) throw error
      
      setCalculations(data || [])
    } catch (err) {
      console.error('Error fetching calculations:', err)
    } finally {
      setLoading(false)
    }
  }

  const exportToPDF = () => {
    const html = `
      <html>
        <head>
          <title>Calculation History</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #0E6E5C; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background: #0E6E5C; color: white; padding: 10px; text-align: left; }
            td { padding: 8px; border-bottom: 1px solid #ddd; }
            tr:hover { background: #f5f5f5; }
          </style>
        </head>
        <body>
          <h1>Calculation History</h1>
          <p>Generated: ${new Date().toLocaleDateString()}</p>
          <table>
            <thead>
              <tr>
                <th>Policyholder</th>
                <th>Policy #</th>
                <th>State</th>
                <th>Premium</th>
                <th>Tax</th>
                <th>Total</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              ${calculations.map(calc => `
                <tr>
                  <td>${calc.policyholder_name || '—'}</td>
                  <td>${calc.policy_number || '—'}</td>
                  <td>${calc.state}</td>
                  <td>$${parseFloat(calc.premium).toFixed(2)}</td>
                  <td>$${parseFloat(calc.tax_amount).toFixed(2)}</td>
                  <td>$${parseFloat(calc.total_amount).toFixed(2)}</td>
                  <td>${new Date(calc.created_at).toLocaleDateString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `
    
    const element = document.createElement('div')
    element.innerHTML = html
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js'
    document.head.appendChild(script)
    
    script.onload = () => {
      const opt = {
        margin: 10,
        filename: 'calculation-history.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'landscape', unit: 'mm', format: 'a4' }
      }
      html2pdf().set(opt).from(html).save()
    }
  }

  const exportToExcel = () => {
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.min.js'
    document.head.appendChild(script)
    
    script.onload = () => {
      const data = calculations.map(calc => ({
        'Policyholder': calc.policyholder_name || '—',
        'Policy Number': calc.policy_number || '—',
        'State': calc.state,
        'Premium': parseFloat(calc.premium).toFixed(2),
        'Tax': parseFloat(calc.tax_amount).toFixed(2),
        'Total': parseFloat(calc.total_amount).toFixed(2),
        'Date': new Date(calc.created_at).toLocaleDateString(),
      }))
      
      const ws = XLSX.utils.json_to_sheet(data)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Calculations')
      XLSX.writeFile(wb, 'calculation-history.xlsx')
    }
  }

  if (loading) {
    return <p style={{ color: 'var(--muted)' }}>Loading history...</p>
  }

  if (calculations.length === 0) {
    return (
      <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '20px' }}>
        No calculations yet. Use the calculator above to get started!
      </p>
    )
  }

  return (
    <div style={{ marginTop: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ marginBottom: '0', fontFamily: 'Georgia, serif' }}>
          Recent Calculations (Last 10)
        </h3>
        <div style={{ display: 'flex', gap: '8px' }}>
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
            📄 Export PDF
          </button>
          <button
            onClick={exportToExcel}
            style={{
              padding: '8px 16px',
              background: 'var(--stamp)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 'bold',
            }}
          >
            📊 Export Excel
          </button>
        </div>
      </div>
      
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--rule)', background: 'var(--teal-soft)' }}>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', fontSize: '12px' }}>Policyholder</th>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', fontSize: '12px' }}>Policy #</th>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', fontSize: '12px' }}>State</th>
            <th style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', fontSize: '12px' }}>Premium</th>
            <th style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', fontSize: '12px' }}>Tax</th>
            <th style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', fontSize: '12px' }}>Total</th>
            <th style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', fontSize: '12px' }}>Date</th>
          </tr>
        </thead>
        <tbody>
          {calculations.map((calc, idx) => (
            <tr key={idx} style={{ borderBottom: '1px solid var(--rule-soft)' }}>
              <td style={{ padding: '12px', fontSize: '14px' }}>
                {calc.policyholder_name || '—'}
              </td>
              <td style={{ padding: '12px', fontSize: '14px', fontFamily: 'monospace' }}>
                {calc.policy_number || '—'}
              </td>
              <td style={{ padding: '12px', fontWeight: 'bold' }}>{calc.state}</td>
              <td style={{ padding: '12px', textAlign: 'right' }}>${parseFloat(calc.premium).toFixed(2)}</td>
              <td style={{ padding: '12px', textAlign: 'right', color: 'var(--teal)', fontWeight: 'bold' }}>
                ${parseFloat(calc.tax_amount).toFixed(2)}
              </td>
              <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>
                ${parseFloat(calc.total_amount).toFixed(2)}
              </td>
              <td style={{ padding: '12px', textAlign: 'right', fontSize: '12px', color: 'var(--muted)' }}>
                {new Date(calc.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
