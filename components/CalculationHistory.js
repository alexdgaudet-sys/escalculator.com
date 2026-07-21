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
      <h3 style={{ marginBottom: '16px', fontFamily: 'Georgia, serif' }}>
        Recent Calculations (Last 10)
      </h3>
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
