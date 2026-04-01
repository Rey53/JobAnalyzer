export const buildEmailHtml = (d) => {
  const rows = d.days.map(r => `
    <tr style="border-bottom:1px solid #2e3350;">
      <td style="padding:8px 10px;font-weight:600;color:#e8eaf2;">${r.day}</td>
      <td style="padding:8px 10px;font-weight:700;color:${r.hours > 0 ? '#22c55e' : '#8891b4'};">${r.hours}</td>
      <td style="padding:8px 10px;color:#8891b4;">${r.date || '—'}</td>
      <td style="padding:8px 10px;color:#8891b4;">${r.project || '—'}</td>
      <td style="padding:8px 10px;color:#8891b4;font-size:12px;">${r.desc || ''}</td>
    </tr>`).join('');

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:20px;background-color:#0f1117;color:#e8eaf2;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<div style="max-width:800px;margin:0 auto;">
  <!-- Header -->
  <table width="100%" cellspacing="0" cellpadding="0" style="background:linear-gradient(135deg,#1e2a6e,#12173b);border-radius:12px;margin-bottom:20px;">
    <tr>
      <td style="padding:32px;">
        <div style="font-size:28px;font-weight:800;color:#ffffff;margin-bottom:4px;">Weekly Timesheet No. ${d.weekNumber || '1'}</div>
        <div style="color:#8891b4;font-size:14px;">MiniMed Personal · Professional Services · Puerto Rico</div>
      </td>
    </tr>
  </table>

  <!-- Info Grid -->
  <table width="100%" cellspacing="10" cellpadding="0" style="margin:0 -10px 10px -10px;">
    <tr>
      <td width="33%" style="background:#1a1d27;border:1px solid #2e3350;border-radius:12px;padding:16px;">
        <div style="color:#8891b4;font-size:10px;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Professional</div>
        <div style="color:#e8eaf2;font-weight:700;font-size:14px;">${d.professionalName || '—'}</div>
      </td>
      <td width="33%" style="background:#1a1d27;border:1px solid #2e3350;border-radius:12px;padding:16px;">
        <div style="color:#8891b4;font-size:10px;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Company</div>
        <div style="color:#e8eaf2;font-weight:700;font-size:14px;">${d.company || '—'}</div>
      </td>
      <td width="33%" style="background:#1a1d27;border:1px solid #2e3350;border-radius:12px;padding:16px;">
        <div style="color:#8891b4;font-size:10px;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Title</div>
        <div style="color:#e8eaf2;font-weight:700;font-size:14px;">${d.title || '—'}</div>
      </td>
    </tr>
    <tr>
      <td width="33%" style="background:#1a1d27;border:1px solid #2e3350;border-radius:12px;padding:16px;">
        <div style="color:#8891b4;font-size:10px;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Week Starting</div>
        <div style="color:#e8eaf2;font-weight:700;font-size:14px;">${d.weekStart || '—'}</div>
      </td>
      <td width="33%" style="background:#1a1d27;border:1px solid #2e3350;border-radius:12px;padding:16px;">
        <div style="color:#8891b4;font-size:10px;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Supervisor</div>
        <div style="color:#e8eaf2;font-weight:700;font-size:14px;">${d.supervisor || '—'}</div>
      </td>
      <td width="33%" style="background:#1a1d27;border:1px solid #2e3350;border-radius:12px;padding:16px;">
        <div style="color:#8891b4;font-size:10px;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Project Code</div>
        <div style="color:#e8eaf2;font-weight:700;font-size:14px;">${d.projectCode || '—'}</div>
      </td>
    </tr>
  </table>

  <!-- Time Table -->
  <div style="background:#1a1d27;border:1px solid #2e3350;border-radius:12px;overflow:hidden;margin-bottom:20px;">
    <div style="background:#20243a;padding:12px 20px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#8891b4;">Daily Time Entries</div>
    <table width="100%" cellspacing="0" cellpadding="0" style="font-size:13px;border-collapse:collapse;">
      <thead>
        <tr style="background:#20243a;">
          <th style="padding:10px 20px;color:#8891b4;text-align:left;font-size:10px;text-transform:uppercase;border-bottom:1px solid #2e3350;">Day</th>
          <th style="padding:10px;color:#8891b4;font-size:10px;text-transform:uppercase;border-bottom:1px solid #2e3350;">Hours</th>
          <th style="padding:10px;color:#8891b4;font-size:10px;text-transform:uppercase;border-bottom:1px solid #2e3350;">Date</th>
          <th style="padding:10px;color:#8891b4;font-size:10px;text-transform:uppercase;border-bottom:1px solid #2e3350;">Project/Task</th>
          <th style="padding:10px 20px;color:#8891b4;font-size:10px;text-transform:uppercase;text-align:left;border-bottom:1px solid #2e3350;">Description</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
      <tfoot>
        <tr style="background:#1e2540;">
          <td style="padding:16px 20px;text-align:right;color:#8891b4;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">TOTAL WEEKLY HOURS</td>
          <td style="padding:16px 10px;text-align:center;font-size:18px;font-weight:800;color:#22c55e;">${d.totalHours}</td>
          <td colspan="3"></td>
        </tr>
      </tfoot>
    </table>
  </div>

  <!-- Summary Grid -->
  <table width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:20px;">
    <tr>
      <td width="55%" valign="top" style="padding-right:10px;">
        <div style="background:#1a1d27;border:1px solid #2e3350;border-radius:12px;padding:24px;">
          <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#8891b4;margin-bottom:20px;">💰 Pay & Withholding Summary</div>
          <table width="100%" cellspacing="0" cellpadding="0">
            <tr><td style="padding:10px 0;color:#e8eaf2;font-size:14px;">Gross Pay</td><td style="text-align:right;font-weight:700;color:#22c55e;font-size:14px;">${d.grossPay}</td></tr>
            <tr><td style="padding:10px 0;color:#e8eaf2;font-size:14px;">PR Hacienda (10%)</td><td style="text-align:right;font-weight:700;color:#ef4444;font-size:14px;">-${d.prWithholding}</td></tr>
            <tr style="border-top:2px solid #2e3350;"><td style="padding:20px 0 0;color:#ffffff;font-size:16px;font-weight:700;">Client Check / Net Pay</td><td style="text-align:right;font-size:24px;font-weight:800;color:#22c55e;padding-top:20px;">${d.netPay}</td></tr>
            <tr><td style="padding:20px 0 5px;color:#8891b4;font-size:10px;font-weight:700;text-transform:uppercase;">Tax To Save for IRS 1040-PR</td><td style="text-align:right;"></td></tr>
            <tr><td style="padding:5px 0;color:#8891b4;font-size:12px;">Social Security Est (12.4%)</td><td style="text-align:right;font-weight:700;color:#f59e0b;font-size:12px;">${d.socialSecurity}</td></tr>
            <tr><td style="padding:5px 0;color:#8891b4;font-size:12px;">Medicare Est (2.9%)</td><td style="text-align:right;font-weight:700;color:#f59e0b;font-size:12px;">${d.medicare}</td></tr>
          </table>
        </div>
      </td>
      <td width="45%" valign="top" style="padding-left:10px;">
        <div style="background:#1a1d27;border:1px solid #2e3350;border-radius:12px;padding:24px;">
          <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#8891b4;margin-bottom:20px;">📈 YTD Accumulation</div>
          <table width="100%" cellspacing="0" cellpadding="0">
            <tr><td style="padding:6px 0;color:#8891b4;font-size:13px;">New YTD Gross</td><td style="text-align:right;color:#818cf8;font-size:14px;font-weight:700;">${d.newYtdGross}</td></tr>
            <tr><td style="padding:6px 0;color:#8891b4;font-size:13px;">New YTD Net</td><td style="text-align:right;color:#818cf8;font-size:14px;font-weight:700;">${d.newYtdNet}</td></tr>
            <tr><td style="padding:15px 0 5px;color:#8891b4;font-size:11px;">Total Hacienda Retention</td><td style="text-align:right;color:#ef4444;font-size:11px;padding-top:15px;">-${d.totalRetentions}</td></tr>
          </table>
        </div>
      </td>
    </tr>
  </table>

  ${d.comments ? `
  <div style="background:#1a1d27;border:1px solid #2e3350;border-radius:12px;padding:20px;margin-bottom:20px;">
    <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#8891b4;margin-bottom:10px;">Comments</div>
    <div style="color:#e8eaf2;font-size:13px;line-height:1.6;">${d.comments}</div>
  </div>` : ''}

  <!-- Signatures Grid -->
  <table width="100%" cellspacing="0" cellpadding="0" style="background:#1a1d27;border:1px solid #2e3350;border-radius:12px;margin-bottom:20px;">
    <tr>
      <td width="50%" style="padding:24px;border-right:1px solid #2e3350;">
        <div style="color:#8891b4;font-size:10px;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Professional Signature</div>
        <div style="color:#e8eaf2;font-weight:700;font-size:16px;">${d.profSignature || d.professionalName || '—'}</div>
        <div style="color:#8891b4;font-size:12px;margin-top:4px;">Date: ${d.profSignDate || '—'}</div>
      </td>
      <td width="50%" style="padding:24px;">
        <div style="color:#8891b4;font-size:10px;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Supervisor Signature</div>
        <div style="color:#e8eaf2;font-weight:700;font-size:16px;">${d.supSignature || d.supervisor || '—'}</div>
        <div style="color:#8891b4;font-size:12px;margin-top:4px;">Date: ${d.supSignDate || '—'}</div>
      </td>
    </tr>
  </table>

  <!-- Footer -->
  <div style="text-align:center;color:#8891b4;font-size:11px;padding:20px 0;line-height:1.8;">
    <strong>MiniMed Personal Timesheet System</strong><br/>
    Puerto Rico · Independiente PR Law 10% Withholding<br/>
    Email Generated At: ${new Date().toLocaleString('en-US', {timeZone:'America/Puerto_Rico'})} AST
  </div>
</div>
</body></html>`;
};
