import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function SDEFormGenerator({ calculation }) {
  const [loading, setLoading] = useState(false)
  const [reasonForSurplus, setReasonForSurplus] = useState('Standard market unable to provide adequate coverage at competitive rates')
  const [insuredType, setInsuredType] = useState('Business')

  const generateSDEPDF = async () => {
    setLoading(true)
    try {
      const html = `
        <html>
          <head>
            <title>SDE Form ${calculation.state}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; background: white; }
              .header { text-align: center; border-bottom: 3px solid #0E6E5C; padding-bottom: 15px; margin-bottom: 20px; }
              .header h1 { margin: 0; color: #0E6E5C; font-size: 24px; }
              .header p { margin: 5px 0 0 0; color: #666; font-size: 12px; }
              .section { margin-bottom: 25px; }
              .section-title { background: #f0f0f0; padding: 10px 12px; font-weight: bold; border-left: 4px solid #0E6E5C; margin-bottom: 12px; }
              .form-row { margin-bottom: 12px; }
              .form-field { border-bottom: 1px solid #ccc; padding-bottom: 8px; }
              .form-field label { font-size: 11px; font-weight: bold; color: #666; text-transform: uppercase; display: block; margin-bottom: 4px; }
              .form-field .value { font-size: 13px; color: #333; }
              table { width: 100%; border-collapse: collapse; margin-top: 10px; }
              table th { background: #f0f0f0; padding: 8px; text-align: left; font-size: 11px; font-weight: bold; border-bottom: 2px solid #0E6E5C; }
              table td { padding: 8px; border-bottom: 1px solid #ddd; }
              .total-row { background: #f9f9f9; font-weight: bold; }
              .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 10px; color: #666; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>SURPLUS DISCLOSURE EXAMINATION (SDE) FORM</h1>
              <p>State of ${calculation.state} | ${new Date().toLocaleDateString()}</p>
            </div>

            <div class="section">
              <div class="section-title">INSURED INFORMATION</div>
              <div class="form-row">
                <div class="form-field">
                  <label>Insured Name:</label>
                  <div class="value">${calculation.policyholderName || '____________________________'}</div>
                </div>
              </div>
              <div class="form-row">
                <div class="form-field">
                  <label>Type of Insured:</label>
                  <div class="value">${insuredType}</div>
                </div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">COVERAGE INFORMATION</div>
              <div class="form-row">
                <div class="form-field">
                  <label>Policy Number:</label>
                  <div class="value">${calculation.policyNumber || '____________________________'}</div>
                </div>
              </div>
              <div class="form-row">
                <div class="form-field">
                  <label>Effective Date:</label>
                  <div class="value">${calculation.effectiveDate || '____________________________'}</div>
                </div>
              </div>
              <div class="form-row">
                <div class="form-field">
                  <label>State:</label>
                  <div class="value">${calculation.state}</div>
                </div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">REASON FOR SURPLUS LINES PLACEMENT</div>
              <div class="form-row">
                <div class="form-field">
                  <label>Reason:</label>
                  <div class="value">${reasonForSurplus}</div>
                </div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">PREMIUM & TAX SUMMARY</div>
              <table>
                <thead>
                  <tr>
                    <th>Description</th>
                    <th style="text-align: right;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Base Premium</td>
                    <td style="text-align: right;">$${parseFloat(calculation.premium).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Stamping Fees</td>
                    <td style="text-align: right;">$${parseFloat(calculation.stampingFees || 0).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Agent Policy Fee</td>
                    <td style="text-align: right;">$${parseFloat(calculation.agentPolicyFee || 0).toFixed(2)}</td>
                  </tr>
                  <tr class="total-row">
                    <td>Tax Amount (${calculation.state})</td>
                    <td style="text-align: right;">$${parseFloat(calculation.tax).toFixed(2)}</td>
                  </tr>
                  <tr class="total-row">
                    <td>TOTAL DUE</td>
                    <td style="text-align: right;">$${parseFloat(calculation.total).toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="footer">
              <p>Generated by E&S Calculator | www.escalculator.com</p>
              <p>This form must be filed with the state insurance department.</p>
            </div>
          </body>
        </html>
      `

      // Save to Supabase
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('sde_forms').insert([
          {
            user_id: user.id,
            state: calculation.state,
            policyholder_name: calculation.policyholderName,
            policy_number: calculation.policyNumber,
            premium: calculation.premium,
            tax_amount: calculation.tax,
            total_amount: calculation.total,
          }
        ]).catch(err => console.error('Supabase insert error:', err))
      }

      // Generate PDF
      const script = document.createElement('script')
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js'
      document.head.appendChild(script)
      
      script.onload = () => {
        const opt = {
          margin: 15,
          filename: `SDE-Form-${calculation.state}-${calculation.policyholderName || 'Form'}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
        }
        html2pdf().set(opt).from(html).save()
      }
    } catch (err) {
      console.error('Error generating SDE form:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ marginTop: '20px', padding: '16px', background: 'white', borderRadius: '6px', border: '2px solid var(--stamp)' }}>
      <h4 style={{ marginBottom: '16px', fontFamily: 'Georgia, serif', color: 'var(--stamp)' }}>📄 Generate SDE Compliance Form</h4>
      
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)' }}>
          Insured Type
        </label>
        <select
          value={insuredType}
          onChange={(e) => setInsuredType(e.target.value)}
          style={{ width: '100%', padding: '8px', border: '1px solid var(--rule)', borderRadius: '4px', fontSize: '14px' }}
        >
          <option value="Business">Business</option>
          <option value="Individual">Individual</option>
          <option value="Non-Profit">Non-Profit</option>
          <option value="Government">Government</option>
        </select>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)' }}>
          Reason for Surplus Lines
        </label>
        <textarea
          value={reasonForSurplus}
          onChange={(e) => setReasonForSurplus(e.target.value)}
          style={{ width: '100%', padding: '8px', border: '1px solid var(--rule)', borderRadius: '4px', fontSize: '14px', minHeight: '60px', fontFamily: 'Arial, sans-serif' }}
        />
      </div>

      <button
        onClick={generateSDEPDF}
        disabled={loading}
        style={{
          width: '100%',
          padding: '10px',
          background: loading ? '#ccc' : 'var(--stamp)',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontWeight: 'bold',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '14px',
        }}
      >
        {loading ? 'Generating...' : '📄 Generate & Download SDE Form'}
      </button>
    </div>
  )
}
