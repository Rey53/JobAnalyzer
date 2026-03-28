import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';

// Constants synced with original PRD
const RATE = 53;
const PR_WH_RATE = 0.10;
const SS_RATE = 0.124;
const MEDICARE_RATE = 0.029;
const EXEMPT_LIMIT = 500;

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const WEEKEND_INDICES = [5, 6];

export function useTimesheet() {
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState('idle'); // idle, pending, syncing, saved, error
  const [profInfo, setProfInfo] = useState({
    name: 'Luis G. Reyes Morales',
    company: 'MiniMed – Juncos',
    title: 'Sr. Quality Engineer',
    supervisor: 'Charlene González',
    projectCode: 'EQValPR',
    tsNumber: 1,
    weekStart: '', // Sets on init
    prevYtdGross: 0,
    prevYtdNet: 0,
    comments: '',
    profSignature: '',
    profSignDate: '',
    supSignature: '',
    supSignDate: '',
    recipientEmail: 'reyenergybroker@gmail.com',
    ccEmail: ''
  });

  const [entries, setEntries] = useState(
    DAYS.map((day, i) => ({
      day,
      date: '',
      start: WEEKEND_INDICES.includes(i) ? '' : '08:00',
      lunchOut: WEEKEND_INDICES.includes(i) ? '' : '12:00',
      lunchIn: WEEKEND_INDICES.includes(i) ? '' : '13:00',
      end: WEEKEND_INDICES.includes(i) ? '' : '17:00',
      description: '',
      hours: 0
    }))
  );

  const [totals, setTotals] = useState({
    totalHours: 0,
    grossPay: 0,
    prWh: 0,
    ss: 0,
    medicare: 0,
    totalRet: 0,
    netPay: 0,
    newYtdGross: 0,
    newYtdNet: 0,
    effectiveRate: 0
  });

  // ── INIT DEFAULTS ──
  useEffect(() => {
    // Basic day cascading logic from original script
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    const diff = dayOfWeek === 0 ? 1 : (8 - dayOfWeek) % 7 || 7;
    monday.setDate(today.getDate() + (dayOfWeek === 1 ? 0 : diff));
    
    const weekStartIso = monday.toISOString().split('T')[0];
    const todayIso = today.toISOString().split('T')[0];

    setProfInfo(prev => ({
      ...prev,
      weekStart: weekStartIso,
      profSignDate: todayIso,
      supSignDate: todayIso
    }));

    // Local storage restore
    const saved = localStorage.getItem('minimed_app_state_v2');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setProfInfo(prev => ({ ...prev, ...data.profInfo }));
        setEntries(data.entries);
      } catch (e) {
        console.error('Local Storage Restore Failed', e);
      }
    }
    setLoading(false);
  }, []);

  // ── CALCULATE INDIVIDUAL ROW ──
  const calculateRowHours = useCallback((entry) => {
    if (!entry.start || !entry.end) return 0;
    
    const toMin = (t) => {
      if (!t) return null;
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    };

    const start = toMin(entry.start);
    const lout = toMin(entry.lunchOut);
    const lin = toMin(entry.lunchIn);
    const end = toMin(entry.end);

    let amMin = (lout && start && lout > start) ? (lout - start) : 0;
    let pmMin = (end && lin && end > lin) ? (end - lin) : 0;

    if (start !== null && end !== null && end > start && (!lout || !lin)) {
      return (end - start) / 60;
    }
    return (amMin + pmMin) / 60;
  }, []);

  // ── RE-CALCULATE ALL WHEN ENTRIES OR PROF INFO CHANGE ──
  useEffect(() => {
    if (loading) return;

    const newEntries = entries.map(e => ({
      ...e,
      hours: calculateRowHours(e)
    }));

    const totalHours = newEntries.reduce((acc, e) => acc + e.hours, 0);
    const gross = totalHours * RATE;
    
    // YTD & Exemption logic
    const prevGross = parseFloat(profInfo.prevYtdGross) || 0;
    const prevNet = parseFloat(profInfo.prevYtdNet) || 0;
    const totalYtdGross = prevGross + gross;
    
    const prSubject = Math.max(0, totalYtdGross - Math.max(EXEMPT_LIMIT, prevGross));
    const prWh = prSubject * PR_WH_RATE;
    const ss = gross * SS_RATE;
    const medicare = gross * MEDICARE_RATE;
    const totalRet = prWh + ss + medicare;
    const net = gross - totalRet;

    setTotals({
      totalHours: totalHours.toFixed(2),
      grossPay: gross,
      prWh,
      ss,
      medicare,
      totalRet,
      netPay: net,
      newYtdGross: totalYtdGross,
      newYtdNet: prevNet + net,
      effectiveRate: gross > 0 ? (totalRet / gross) * 100 : 0
    });

    // Save to LocalStorage
    localStorage.setItem('minimed_app_state_v2', JSON.stringify({ profInfo, entries: newEntries }));
    
    // Debounced sync to Supabase
    setSyncStatus('pending');
  }, [entries, profInfo, loading, calculateRowHours]);

  // ── SUPABASE SYNC LOGIC ──
  const syncTimer = useRef(null);
  useEffect(() => {
    if (loading || syncStatus !== 'pending') return;

    if (syncTimer.current) clearTimeout(syncTimer.current);
    
    syncTimer.current = setTimeout(async () => {
      setSyncStatus('syncing');
      try {
        const payload = { profInfo, entries, totals, generatedAt: new Date().toISOString() };
        
        // Find if row exists for user & week
        const { data: existing } = await supabase
          .from('timesheets')
          .select('id')
          .eq('professional_email', profInfo.recipientEmail)
          .eq('payload->>weekStart', profInfo.weekStart)
          .limit(1);

        if (existing && existing.length > 0) {
          await supabase.from('timesheets').update({ payload, updated_at: new Date().toISOString() }).eq('id', existing[0].id);
        } else {
          await supabase.from('timesheets').insert([{ 
            payload, 
            professional_email: profInfo.recipientEmail,
            updated_at: new Date().toISOString()
          }]);
        }
        setSyncStatus('saved');
      } catch (e) {
        console.error('Supabase Sync Error', e);
        setSyncStatus('error');
      }
    }, 2000);

    return () => clearTimeout(syncTimer.current);
  }, [profInfo, entries, totals, loading, syncStatus]);

  return {
    profInfo, setProfInfo,
    entries, setEntries,
    totals,
    syncStatus,
    loading
  };
}
