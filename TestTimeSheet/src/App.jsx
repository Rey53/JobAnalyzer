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
  FileText
} from 'lucide-react';
import { useTimesheet } from './hooks/useTimesheet';
import './App.css';

function App() {
  const { 
    profInfo, setProfInfo, 
    entries, setEntries, 
    totals, 
    syncStatus, 
    loading 
  } = useTimesheet();

  const [loggedIn, setLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ user: '', pass: '' });
  const [loginError, setLoginError] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const checkLogin = async () => {
    setLoginError(false);
    
    // 1. MASTER KEY OVERRIDE
    if ((loginForm.user === 'EqvalAdmin' && loginForm.pass === 'Eqval2026!') || 
        (loginForm.user === 'reyenergybroker@gmail.com' && loginForm.pass === 'Eqval2026!')) {
      setLoggedIn(true);
      return;
    }

    // 2. SUPABASE REAL AUTH
    setIsAuthLoading(true);
    try {
      const { data, error } = await import('./lib/supabase').then(m => m.supabase.auth.signInWithPassword({
        email: loginForm.user,
        password: loginForm.pass
      }));

      if (error) throw error;
      if (data?.user) {
        setLoggedIn(true);
      }
    } catch (e) {
      console.error("Login Error:", e.message);
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
            <div className="badge pr-badge">
              <ShieldCheck size={14} /> 🇵🇷 Puerto Rico
            </div>
            
            <div className={`sync-indicator ${syncStatus}`}>
              <div className="status-dot"></div>
              <span>
                {syncStatus === 'syncing' ? 'Syncing...' : 
                 syncStatus === 'saved' ? 'Cloud Saved' : 
                 syncStatus === 'error' ? 'Sync Failed' : 
                 syncStatus === 'pending' ? 'Pending Sync' : 'Local Mode'}
              </span>
            </div>

            <button className="btn-logout" onClick={() => setLoggedIn(false)}>
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

        {/* ── SECTION 1: HEADER INFO ── */}
        <section className="card glass section-card">
          <div className="section-title">
            <User size={16} /> Professional & Project Info
          </div>
          <div className="grid-2">
            <InputGroup label="Professional (Employee) Name" value={profInfo.name} onChange={(v) => setProfInfo({ ...profInfo, name: v })} />
            <InputGroup label="Company / Client" value={profInfo.company} onChange={(v) => setProfInfo({ ...profInfo, company: v })} />
            <InputGroup label="Job Title / Role" value={profInfo.title} onChange={(v) => setProfInfo({ ...profInfo, title: v })} />
            <InputGroup label="Week Starting (Monday)" type="date" value={profInfo.weekStart} onChange={(v) => setProfInfo({ ...profInfo, weekStart: v })} />
            <InputGroup label="Supervisor Name" value={profInfo.supervisor} onChange={(v) => setProfInfo({ ...profInfo, supervisor: v })} />
            <InputGroup label="Project / PO Code" value={profInfo.projectCode} onChange={(v) => setProfInfo({ ...profInfo, projectCode: v })} />
            <InputGroup label="Timesheet #" type="number" value={profInfo.tsNumber} onChange={(v) => setProfInfo({ ...profInfo, tsNumber: v })} />
          </div>
        </section>

        {/* ── SECTION 2: TOTALS BANNER ── */}
        <motion.section 
          whileHover={{ scale: 1.01 }}
          className="total-banner glass"
        >
          <div className="total-item">
            <div className="label">Total Hours This Week</div>
            <div className="total-value">
              {totals.totalHours} <span>hrs</span>
            </div>
          </div>
          <div className="total-item align-right">
            <div className="label">Gross Pay (Hidden)</div>
            <div className="total-value accent">
              ${(parseFloat(totals.grossPay) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                  <th className="center">Hours</th>
                  <th className="center">Start</th>
                  <th className="center">Lunch Out</th>
                  <th className="center">Lunch In</th>
                  <th className="center">End</th>
                  <th>Work Description</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, i) => (
                  <tr key={entry.day}>
                    <td className="day-name">
                      <div className={`dot ${[5,6].includes(i) ? 'weekend' : ''}`}></div>
                      {entry.day}
                    </td>
                    <td className={`center hours ${entry.hours > 0 ? 'active' : ''}`}>{entry.hours.toFixed(2)}</td>
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
                    <td className="desc-cell">
                      <textarea 
                        value={entry.description} 
                        onChange={(e) => {
                          const newEntries = [...entries];
                          newEntries[i].description = e.target.value;
                          setEntries(newEntries);
                        }}
                        placeholder="Work performed..."
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── SECTION 4: FINANCIAL SUMMARY ── */}
        <div className="pay-summary-grid">
          <PayCard 
            label="Gross Pay" 
            value={totals.grossPay} 
            sub="Total hrs × Rate" 
            color="var(--green)" 
            icon={<TrendingUp size={16} />} 
          />
          <PayCard 
            label="PR Hacienda (10%)" 
            value={totals.prWh} 
            sub="PR Law Withholding" 
            color="var(--red)" 
            icon={<ShieldCheck size={16} />} 
            isNegative 
          />
          <PayCard 
            label="Social Security" 
            value={totals.ss} 
            sub="FICA Tax (12.4%)" 
            color="var(--amber)" 
            icon={<CreditCard size={16} />} 
            isNegative 
          />
          <PayCard 
            label="Medicare" 
            value={totals.medicare} 
            sub="Tax Part A (2.9%)" 
            color="var(--amber)" 
            icon={<CreditCard size={16} />} 
            isNegative 
          />
          <PayCard 
            label="Net Pay" 
            value={totals.netPay} 
            sub="After All Retentions" 
            color="#fff" 
            icon={<CheckCircle2 size={16} />} 
            isStrong 
          />
        </div>

        {/* ── SECTION 5: YTD & SIGNATURES ── */}
        <div className="grid-2">
          <section className="card glass">
            <div className="section-title"><TrendingUp size={16} /> YTD Accumulation</div>
            <div className="input-group">
              <label className="label">Previous Total Gross ($)</label>
              <input type="number" value={profInfo.prevYtdGross} onChange={(e) => setProfInfo({ ...profInfo, prevYtdGross: e.target.value })} />
            </div>
            <div className="ytd-row mt-2">
              <span>New YTD Gross:</span>
              <strong className="accent">${totals.newYtdGross.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
            </div>
            <div className="ytd-row">
              <span>Current Retention Rate:</span>
              <strong>{totals.effectiveRate.toFixed(2)}%</strong>
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
            <button className="btn-primary flex-2">
              <Send size={18} /> Send via n8n Automation
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

function InputGroup({ label, type = "text", value, onChange }) {
  return (
    <div className="input-group">
      <label className="label">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} />
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

function TimeSelect({ value, onChange }) {
  const options = [''];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      const hh = h.toString().padStart(2, '0');
      const mm = m.toString().padStart(2, '0');
      options.push(`${hh}:${mm}`);
    }
  }

  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map(opt => {
        if (!opt) return <option key="empty" value="">--</option>;
        const [h, m] = opt.split(':').map(Number);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const dispH = h % 12 || 12;
        return <option key={opt} value={opt}>{`${dispH}:${m.toString().padStart(2, '0')} ${ampm}`}</option>;
      })}
    </select>
  );
}

export default App;
