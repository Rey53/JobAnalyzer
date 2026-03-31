import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  User, 
  Building2, 
  Briefcase, 
  Calendar, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  LogOut, 
  DollarSign, 
  ShieldCheck, 
  Send, 
  Printer, 
  ChevronRight,
  TrendingUp,
  CreditCard,
  RotateCw,
  ChevronLeft,
  FileText
} from 'lucide-react';
import { useTimesheet } from './hooks/useTimesheet';
import { supabase } from './lib/supabase';
import { buildEmailHtml } from './lib/emailTemplate';
import './App.css';

function App() {
  const { 
    profInfo, setProfInfo, 
    entries, setEntries, 
    totals, 
    syncStatus, 
    loading,
    weekNumber,
    rolloverNewWeek,
    rolloverPrevWeek,
    forceSync
  } = useTimesheet();

  const [loggedIn, setLoggedIn] = useState(false);
  const handleLogout = async () => {
    await forceSync();
    setLoggedIn(false);
  };
  const [loginForm, setLoginForm] = useState({ user: '', pass: '' });
  const [loginError, setLoginError] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const sendTimesheet = async () => {
    if (!profInfo.name || !profInfo.company || !profInfo.weekStart || !profInfo.recipientEmail) {
      alert('⚠️ Please fill in all required fields (Name, Company, Week Start, Recipient Email)');
      return;
    }

    setIsSending(true);

    const fmt = (n) => `$${Number(n).toLocaleString('en-US', {minimumFractionDigits:2,maximumFractionDigits:2})}`;

    const payload = {
      professionalName: profInfo.name,
      company: profInfo.company,
      title: profInfo.title,
      weekStart: profInfo.weekStart,
      supervisor: profInfo.supervisor,
      projectCode: profInfo.projectCode,
      comments: profInfo.comments,
      profSignature: profInfo.profSignature,
      profSignDate: profInfo.profSignDate,
      supSignature: profInfo.supSignature,
      supSignDate: profInfo.supSignDate,
      days: (entries || []).map(e => ({
        day: e.day,
        date: e.date,
        project: e.project,
        hours: (Number(e.hours) || 0).toFixed(2),
        desc: e.description
      })),
      rate: 53,
      totalHours: totals.totalHours,
      grossPay: fmt(totals.grossPay || 0),
      grossPayRaw: totals.grossPay || 0,
      prWithholding: fmt(totals.prWh || 0),
      prWithholdingRaw: totals.prWh || 0,
      socialSecurity: fmt(totals.ss || 0),
      socialSecurityRaw: totals.ss || 0,
      medicare: fmt(totals.medicare || 0),
      medicareRaw: totals.medicare || 0,
      totalRetentions: fmt(totals.prWh || 0),
      totalRetentionsRaw: totals.prWh || 0,
      netPay: fmt(totals.netPay || 0),
      netPayRaw: totals.netPay || 0,
      effectiveRate: '10.00%',
      prevYtdGross: fmt(profInfo.prevYtdGross || 0),
      newYtdGross: fmt(totals.newYtdGross || 0),
      prevYtdNet: fmt(profInfo.prevYtdNet || 0),
      newYtdNet: fmt(totals.newYtdNet || 0),

      recipientEmail: profInfo.recipientEmail,
      ccEmail: profInfo.ccEmail,

      generatedAt: new Date().toISOString(),
      tsNumber: profInfo.tsNumber || 1
    };
    
    payload.emailHtml = buildEmailHtml(payload);

    try {
      const res = await fetch('https://n8ncon.servicioxpert.com/webhook/timesheet-send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert('✅ Timesheet sent to ' + payload.recipientEmail);
      } else {
        const text = await res.text();
        throw new Error('Server responded with ' + res.status + ': ' + text);
      }
    } catch (err) {
      console.error('Send error:', err);
      alert('⚠️ Error sending timesheet via n8n. Check console.');
    } finally {
      setIsSending(false);
    }
  };

  const checkLogin = async () => {
    setLoginError(false);
    
    // 1. EMERGENCY MASTER KEY (bypass only)
    if (loginForm.user === 'EqvalAdmin' && loginForm.pass === 'Eqval2026!') {
      setLoggedIn(true);
      return;
    }

    // 2. SUPABASE AUTH — Primary login method
    setIsAuthLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginForm.user,
        password: loginForm.pass
      });

      if (error) throw error;
      if (data?.user) {
        setLoggedIn(true);
      } else {
        setLoginError(true);
      }
    } catch (e) {
      console.error('Supabase Auth Error:', e.message);
      setLoginError(true);
    } finally {
      setIsAuthLoading(false);
    }
  };

  if (!loggedIn) {
    return (
      <div className="login-overlay">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="login-box glass"
        >
          <div className="logo-badge">🕐</div>
          <h2>Authorized Access</h2>
          <p>Please login to view timesheet portal</p>
          
          <div className="input-group">
            <label className="label">Email Address</label>
            <input 
              type="text" 
              placeholder="Enter your email" 
              value={loginForm.user}
              onChange={(e) => setLoginForm({ ...loginForm, user: e.target.value })}
            />
          </div>
          
          <div className="input-group">
            <label className="label">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={loginForm.pass}
              onChange={(e) => setLoginForm({ ...loginForm, pass: e.target.value })}
            />
          </div>

          <button 
            className="btn-primary" 
            onClick={checkLogin} 
            disabled={isAuthLoading}
            style={{ width: '100%' }}
          >
            {isAuthLoading ? 'Authenticating...' : 'Login to Timesheet'}
          </button>
          
          <AnimatePresence>
            {loginError && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="login-error"
              >
                Incorrect Username or Password!
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="app-wrapper">
      {/* ── HERO BANNER ── */}
      <header className="hero glass">
        <div className="container hero-content">
          <div className="hero-left">
            <div className="logo-dot">🕐</div>
            <div>
              <h1>Weekly <span>Timesheet</span></h1>
              <p>MiniMed Personal · Professional Services</p>
            </div>
          </div>
          
          <div className="hero-right">
            <div className="nav-controls badge">
              {weekNumber > 1 ? (
                <button className="nav-btn" onClick={rolloverPrevWeek} title="Previous Week">
                  <ChevronLeft size={16} />
                </button>
              ) : <div style={{width: 24}}></div>}
              <div className="week-display">
                <Calendar size={14} /> Week #{weekNumber}
              </div>
              <button className="nav-btn" onClick={rolloverNewWeek} title="Next Week">
                <RotateCw size={16} />
              </button>
            </div>

            <div className="badge pr-badge">
              <ShieldCheck size={14} /> 🇵🇷 Puerto Rico
            </div>
            
            <div className={`sync-indicator ${syncStatus}`}>
              <div className="status-dot"></div>
              <span>
                {syncStatus === 'fetching' ? 'MySupabaseSH Loading...' :
                 syncStatus === 'syncing' ? 'MySupabaseSH Syncing...' : 
                 syncStatus === 'saved' ? 'MySupabaseSH Saved' : 
                 syncStatus === 'error' ? 'MySupabaseSH Failed' : 
                 syncStatus === 'pending' ? 'Pending MySupabaseSH Sync' : 'Local Mode'}
              </span>
            </div>

            <button className="btn-logout" onClick={handleLogout}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container main">
        <div className="info-banner glass">
          <AlertCircle size={18} color="var(--amber)" />
          <span>Rate: <strong>Applied</strong> · PR Withholding: <strong>10%</strong> (Hacienda – Independent Contractor) · Both PR & Federal retention applied automatically.</span>
        </div>
        <div className="info-banner glass" style={{ marginTop: '-12px', marginBottom: '24px', borderColor: 'rgba(79, 110, 247, 0.3)', background: 'rgba(79, 110, 247, 0.05)' }}>
          <AlertCircle size={18} color="var(--accent)" />
          <span><strong>Important:</strong> This timesheet must be submitted every Tuesday before 5:00 PM to accounts@eqvalpr.com.</span>
        </div>

        {/* ── SECTION 1: HEADER INFO ── */}
        <section className="card glass section-card">
          <div className="section-title">
            <User size={16} /> Professional & Project Info
          </div>
          <div className="grid-2">
            <InputGroup label="Professional (Employee) Name" value={profInfo?.name || ''} onChange={(v) => setProfInfo({ ...profInfo, name: v })} />
            <InputGroup label="Company / Client" value={profInfo?.company || ''} onChange={(v) => setProfInfo({ ...profInfo, company: v })} />
            <InputGroup label="Job Title / Role" value={profInfo?.title || ''} onChange={(v) => setProfInfo({ ...profInfo, title: v })} />
            <InputGroup label="Week Starting (Monday)" type="date" min="2026-03-30" value={profInfo?.weekStart || ''} onChange={(v) => setProfInfo({ ...profInfo, weekStart: v })} />
            <InputGroup label="Supervisor Name" value={profInfo?.supervisor || ''} onChange={(v) => setProfInfo({ ...profInfo, supervisor: v })} />
            <InputGroup label="Project / PO Code" value={profInfo?.projectCode || ''} onChange={(v) => setProfInfo({ ...profInfo, projectCode: v })} />
            <InputGroup label="Timesheet #" type="number" value={profInfo?.tsNumber || ''} onChange={(v) => setProfInfo({ ...profInfo, tsNumber: v })} />
          </div>
        </section>

        {/* ── SECTION 2: TOTALS BANNER ── */}
        <motion.section 
          className="total-banner glass"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="total-item">
            <div className="label">Total Hours This Week</div>
            <div className="total-value">
              {totals?.totalHours || '0.00'} <span>hrs</span>
            </div>
          </div>
          <div className="total-item align-right">
            <div className="label">Gross Pay (Calculated)</div>
            <div className="total-value accent">
              ${(Number(totals?.grossPay) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </motion.section>

        {/* ── SECTION 3: DAILY TABLE ── */}
        <section className="card glass table-card">
          <div className="section-title">
            <Clock size={16} /> Daily Time Entries
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Day</th>
                  <th className="center">Date</th>
                  <th className="center">Hours</th>
                  <th className="center">Start</th>
                  <th className="center">Lunch Out</th>
                  <th className="center">Lunch In</th>
                  <th className="center">End</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(entries) && entries.map((entry, i) => (
                  <React.Fragment key={entry.day}>
                    <tr className={i >= 5 ? 'weekend' : ''}>
                      <td className="day-name">
                        <div className={`dot ${[5,6].includes(i) ? 'weekend' : ''}`}></div>
                        {entry.day}
                      </td>
                      <td className="center date-cell">
                        <input 
                          type="date" 
                          min={i === 0 ? "2026-03-30" : ""}
                          value={entry.date || ''} 
                          readOnly={true}
                          title="Change the Week Starting date above to pick another week"
                          onChange={() => {}} 
                        />
                      </td>
                      <td className={`center hours ${(Number(entry.hours) || 0) > 0 ? 'active' : ''}`}>{(Number(entry.hours) || 0).toFixed(2)}</td>
                      <td className="center"><TimeSelect value={entry.start} onChange={(v) => {
                        const newEntries = [...entries];
                        newEntries[i].start = v;
                        setEntries(newEntries);
                      }} /></td>
                      <td className="center"><TimeSelect value={entry.lunchOut} onChange={(v) => {
                        const newEntries = [...entries];
                        newEntries[i].lunchOut = v;
                        setEntries(newEntries);
                      }} /></td>
                      <td className="center"><TimeSelect value={entry.lunchIn} onChange={(v) => {
                        const newEntries = [...entries];
                        newEntries[i].lunchIn = v;
                        setEntries(newEntries);
                      }} /></td>
                      <td className="center"><TimeSelect value={entry.end} onChange={(v) => {
                        const newEntries = [...entries];
                        newEntries[i].end = v;
                        setEntries(newEntries);
                      }} /></td>
                    </tr>
                    <tr className="desc-row">
                      <td colSpan="7">
                        <textarea
                          value={entry.description}
                          onChange={(e) => {
                            const newEntries = [...entries];
                            newEntries[i].description = e.target.value;
                            setEntries(newEntries);
                          }}
                          onInput={(e) => {
                            e.target.style.height = 'auto';
                            e.target.style.height = e.target.scrollHeight + 'px';
                          }}
                          placeholder={`Work performed on ${entry.day}...`}
                        />
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
              <tfoot>
                <tr className="total-row">
                  <td colSpan="2">Weekly Total</td>
                  <td className="center total-hours-cell">{totals.totalHours} hrs</td>
                  <td colSpan="5"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

        {/* ── SECTION 4: FINANCIAL SUMMARY ── */}
        <div className="pay-summary-grid">
          <PayCard 
            label="Gross Pay" 
            value={totals?.grossPay || 0} 
            sub="Total hrs × Rate" 
            color="var(--green)" 
            icon={<TrendingUp size={16} />} 
          />
          <PayCard 
            label="PR Hacienda (10%)" 
            value={totals?.prWh || 0} 
            sub="Client Withheld" 
            color="var(--red)" 
            icon={<ShieldCheck size={16} />} 
            isNegative 
          />
          <PayCard 
            label="Actual Net Pay" 
            value={totals?.netPay || 0} 
            sub="Amount Paid to You" 
            color="#fff" 
            icon={<CheckCircle2 size={16} />} 
            isStrong 
          />
          <PayCard 
            label="Est. Self-Emp Tax" 
            value={totals?.estimatedSelfEmp || 0} 
            sub="15.3% to Save for IRS" 
            color="var(--amber)" 
            icon={<AlertCircle size={16} />} 
          />
        </div>

        {/* ── SECTION 5: YTD & SIGNATURES ── */}
        <div className="grid-2" style={{ gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)' }}>
          <section className="card glass">
            <div className="section-title"><TrendingUp size={16} /> YTD Accumulation</div>
            
            <div className="grid-2" style={{ gap: '16px', marginBottom: '16px' }}>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '12px' }}>
                <InputGroup label="Prev Total Gross ($)" type="number" value={profInfo.prevYtdGross} onChange={(v) => setProfInfo({ ...profInfo, prevYtdGross: v })} />
                <div className="ytd-row mt-2">
                  <span>New YTD Gross:</span>
                  <strong className="accent">${(totals.newYtdGross || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                </div>
              </div>
              
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '12px' }}>
                <InputGroup label="Prev PR Hacienda ($)" type="number" value={profInfo.prevYtdPrWh} onChange={(v) => setProfInfo({ ...profInfo, prevYtdPrWh: v })} />
                <div className="ytd-row mt-2">
                  <span>New YTD PR Hacienda:</span>
                  <strong className="accent" style={{ color: 'var(--red)' }}>${(totals.newYtdPrWh || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '12px' }}>
                <InputGroup label="Prev Net Pay ($)" type="number" value={profInfo.prevYtdNet} onChange={(v) => setProfInfo({ ...profInfo, prevYtdNet: v })} />
                <div className="ytd-row mt-2">
                  <span>New YTD Net Pay:</span>
                  <strong className="accent" style={{ color: 'var(--green)' }}>${(totals.newYtdNet || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '12px' }}>
                <InputGroup label="Prev Est. Self-Emp ($)" type="number" value={profInfo.prevYtdSelfEmp} onChange={(v) => setProfInfo({ ...profInfo, prevYtdSelfEmp: v })} />
                <div className="ytd-row mt-2">
                  <span>New YTD Self-Emp Tax:</span>
                  <strong className="accent" style={{ color: 'var(--amber)' }}>${(totals.newYtdSelfEmp || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                </div>
              </div>
            </div>

            <div className="ytd-row" style={{ marginTop: '16px', padding: '16px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px', borderLeft: '4px solid var(--amber)', flexDirection: 'column', gap: '8px' }}>
              <div style={{ color: '#fff', fontSize: '0.85rem' }}>
                <AlertCircle size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} color="var(--amber)" />
                <strong>Savings Guide for IRS (1040-PR)</strong>
              </div>
              <span style={{ color: 'var(--text)', lineHeight: '1.4' }}>
                Your Estimated Self-Employment Tax represents <strong>{(totals.selfEmpPercentOfNet || 0).toFixed(1)}%</strong> of your Actual Net Pay this week. Consider transferring this same percentage of your weekly net pay into a separate tax savings account.
              </span>
            </div>
          </section>

          <section className="card glass">
            <div className="section-title"><Clock size={16} /> Comments</div>
            <textarea 
              style={{ height: '100px' }}
              placeholder="Add any additional weekly notes..."
              value={profInfo.comments}
              onChange={(e) => setProfInfo({ ...profInfo, comments: e.target.value })}
            />
          </section>
        </div>

        <section className="card glass">
          <div className="section-title"><ShieldCheck size={16} /> Signatures</div>
          <div className="grid-2">
            <div>
              <label className="label">Professional Signature</label>
              <input type="text" value={profInfo.profSignature} onChange={(e) => setProfInfo({ ...profInfo, profSignature: e.target.value })} />
            </div>
            <div>
              <label className="label">Supervisor Signature</label>
              <input type="text" value={profInfo.supSignature} onChange={(e) => setProfInfo({ ...profInfo, supSignature: e.target.value })} />
            </div>
          </div>
        </section>

        {/* ── SECTION 6: ACTIONS ── */}
        <section className="card glass actions-card">
          <div className="section-title">Finalize & Dispatch</div>
          <div className="btn-group">
            <button 
              className={`btn-primary flex-2 ${isSending ? 'disabled opacity-50 cursor-not-allowed' : ''}`}
              onClick={sendTimesheet}
              disabled={isSending}
            >
              <Send size={18} /> {isSending ? 'Sending via n8n...' : 'Send via n8n Automation'}
            </button>
            <button className="btn-primary btn-secondary flex-1" onClick={() => window.print()}>
              <Printer size={18} /> Print PDF
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

const TimeSelect = ({ value, onChange }) => {
  const times = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      const hh = h.toString().padStart(2, '0');
      const mm = m.toString().padStart(2, '0');
      const displayH = h % 12 || 12;
      const ampm = h < 12 ? 'AM' : 'PM';
      times.push({ val: `${hh}:${mm}`, label: `${displayH}:${mm} ${ampm}` });
    }
  }
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">--</option>
      {times.map(t => <option key={t.val} value={t.val}>{t.label}</option>)}
    </select>
  );
};

function InputGroup({ label, type = "text", value, onChange, min }) {
  return (
    <div className="input-group">
      <label className="label">{label}</label>
      <input type={type} value={value} min={min} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function PayCard({ label, value, sub, color, icon, isNegative, isStrong }) {
  return (
    <div className={`pay-card glass ${isStrong ? 'strong' : ''}`}>
      <div className="pc-top">
        <div className="pc-icon" style={{ backgroundColor: color + '20', color: color }}>{icon}</div>
        <div className="pc-label">{label}</div>
      </div>
      <div className="pc-val" style={{ color: isStrong ? '#fff' : color }}>
        {isNegative ? '-' : ''}${ (Math.abs(parseFloat(value)) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
      </div>
      <div className="pc-sub">{sub}</div>
    </div>
  );
}

export default App;
