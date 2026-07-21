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
            <title>Surplus Disclosure Examination Form - ${calculation.state}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                padding: 20px;
                background: white;
              }
              .header {
                text-align: center;
                border-bottom: 3px solid #0E6E5C;
                padding-bottom: 15px;
                margin-bottom: 20px;
              }
              .header h1 {
                margin: 0;
                color: #0E6E5C;
                font-size: 24px;
              }
              .header p {
                margin: 5px 0 0 0;
                color: #666;
                font-size: 12px;
              }
              .state-badge {
                background: #0E6E5C;
                color: white;
                padding: 4px 12px;
                border-radius: 4px;
                font-weight: bold;
                display: inline-block;
                margin-bottom: 20px;
              }
              .section {
                margin-bottom: 25px;
              }
              .section-title {
                background: #f0f0f0;
                padding: 10px 12px;
                font-weight: bold;
                border-left: 4px solid #0E6E5C;
                margin-bottom: 12px;
              }
              .form-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin-bottom: 12px;
              }
              .form-row.full {
                grid-template-columns: 1fr;
              }
              .form-field {
                border-bottom: 1px solid #ccc;
                padding-bottom: 8px;
              }
              .form-field label {
                font-size: 11px;
                font-weight: bold;
                color: #666;
                text-transform: uppercase;
                display: block;
                margin-bottom: 4px;
              }
              .form-field .value {
                font-size: 13px;
                color: #333;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 10px;
              }
              table th {
                background: #f0f0f0;
                padding: 8px;
                text-align: left;
                font-size: 11px;
                font-weight: bold;
                border-bottom: 2px solid #0E6E5C;
              }
              table td {
                padding: 8px;
                border-bottom: 1px solid #ddd;
              }
              .total-row {
                background: #f9f9f9;
                font-weight: bold;
              }
              .signature-area {
                margin-top: 40px;
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 40px;
              }
              .signature-line {
                border-top: 1px solid #333;
                padding-top: 5px;
                font-size: 11px;
              }
              .footer {
                margin-top: 30px;
                padding-top: 15px;
                border-top: 1px solid #ddd;
                font-size: 10px;
                color: #666;
              }
              .checkbox {
                display: inline-block;
                width: 15px;
                height: 15px;
                border: 1px solid #333;
                margin-right: 8px;
                vertical-align: middle;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>SURPLUS DISCLOSURE EXAMINATION (SDE) FORM</h1>
              <p>State of ${calculation.state} • ${new Date().toLocaleDateString()}</p>
            </div>

            <div class="state-badge">${calculation.state}</div>

            <!-- INSURED INFORMATION -->
            <div class="section">
              <div class="section-title">INSURED INFORMATION</div>
              <div class="form-row">
                <div class="form-field">
                  <label>Insured Name:</label>
                  <div class="value">${calculation.policyholderName || '____________________________'}</div>
                </div>
                <div class="form-field">
                  <label>Type of Insured:</label>
                  <div class="value">${insuredType}</div>
                </div>
              </div>
              <div class="form-row full">
                <div class="form-field">
                  <label>Nature of Business/Exposure:</label>
                  <div class="value">____________________________</div>
                </div>
              </div>
            </div>

            <!-- COVERAGE INFORMATION -->
            <div class="section">
              <div class="section-title">COVERAGE INFORMATION</div>
              <div class="form-row">
                <div class="form-field">
                  <label>Policy Number:</label>
                  <div class="value">${calculation.policy_number || '____________________________'}</div>
                </div>
                <div class="form-field">
                  <label>Effective Date:</label>
                  <div class="value">${calculation.effectiveDate || '____________________________'}</div>
                </div>
              </div>
              <div class="form-row">
                <div class="form-field">
                  <label>Coverage Type:</label>
                  <div class="value">____________________________</div>
                </div>
                <div class="form-field">
                  <label>Coverage Limit:</label>
                  <div class="value">____________________________</div>
                </div>
              </div>
            </div>

            <!-- REASON FOR SURPLUS LINES PLACEMENT -->
            <div class="section">
              <div class="section-title">REASON FOR SURPLUS LINES PLACEMENT</div>
              <div class="form-row full">
                <div class="form-field">
                  <label>Explain why this coverage could not be obtained in the standard market:</label>
                  <div class="value" style="margin-top: 10px; min-height: 40px; border: 1px solid #ccc; padding: 8px;">
                    ${reasonForSurplus}
                  </div>
                </div>
              </div>
            </div>

            <!-- PREMIUM & TAX SUMMARY -->
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
                    <td>Stamping/Processing Fees</td>
                    <td style="text-align: right;">$${parseFloat(calculation.stamping_fees || 0).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Agent Policy Fee</td>
                    <td style="text-align: right;">$${parseFloat(calculation.agent_policy_fee || 0).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Taxable Premium</td>
                    <td style="text-align: right;">$${(parseFloat(calculation.premium) + parseFloat(calculation.stamping_fees || 0) + parseFloat(calculation.agent_policy_fee || 0)).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Tax Rate (${calculation.state})</td>
                    <td style="text-align: right;">${((parseFloat(calculation.tax_amount) / parseFloat(calculation.premium)) * 100).toFixed(2)}%</td>
                  </tr>
                  <tr class="total-row">
                    <td>TOTAL TAXES & FEES</td>
                    <td style="text-align: right;">$${parseFloat(calculation.tax_amount).toFixed(2)}</td>
                  </tr>
                  <tr class="total-row">
                    <td>TOTAL AMOUNT DUE</td>
                    <td style="text-align: right;">$${parseFloat(calculation.total_amount).toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- CERTIFICATIONS -->
            <div class="section">
              <div class="section-title">BROKER CERTIFICATION</div>
              <div class="form-row full">
                <div style="margin-bottom: 12px;">
                  <span class="checkbox"></span>
                  <span>I certify that I have made a diligent effort to place this coverage in the standard market before seeking surplus lines placement.</span>
                </div>
              </div>
              <div class="form-row full">
                <div style="margin-bottom: 12px;">
                  <span class="checkbox"></span>
                  <span>I certify that all information provided in this SDE form is accurate and complete.</span>
                </div>
              </div>
            </div>

            <!-- SIGNATURES -->
            <div class="signature-area">
              <div>
                <div style="margin-bottom: 20px;">Broker Signature: ________________________</div>
                <div class="signature-line">Date</div>
              </div>
              <div>
                <div style="margin-bottom: 20px;">Stamping Office: ________________________</div>
                <div class="signature-line">Date</div>
              </div>
            </div>

            <!-- FOOTER -->
            <div class="footer">
              <p>Generated by E&S Calculator | www.escalculator.com</p>
              <p>This form is for compliance purposes and must be filed with the state insurance department.</p>
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
            policy_number: calculation.policy_number,
            premium: calculation.premium,
            tax_amount: calculation.tax_amount,
            total_amount: calculation.total_amount,
          }
        ])
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
    <div style={{ marginTop: '20px', padding: '16px', background: 'var(--card)', borderRadius: '6px', border: '1px solid var(--rule)' }}>
      <h4 style={{ marginBottom: '16px', fontFamily: 'Georgia, serif' }}>Generate SDE Form</h4>
      
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)' }}>
          Insured
