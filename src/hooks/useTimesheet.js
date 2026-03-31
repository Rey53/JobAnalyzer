import { useState, useEffect, useMemo, useRef } from 'react';
import { supabase } from '../lib/supabase';

// Constants synced with original PRD
const RATE = 53;
const PR_WH_RATE = 0.10;
const SS_RATE = 0.124;
const MEDICARE_RATE = 0.029;
const EXEMPT_LIMIT = 500;

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const WEEKEND_INDICES = [5, 6];
const WEEK_ONE_START = new Date('2026-03-30T00:00:00'); // 03/30/2026 = Week 1

function getMonday() {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  const Y = d.getFullYear();
  const M = (d.getMonth() + 1).toString().padStart(2, '0');
  const D = d.getDate().toString().padStart(2, '0');
  const formatted = `${Y}-${M}-${D}`;
  return formatted < '2026-03-30' ? '2026-03-30' : formatted;
}

function buildDates(weekStart) {
  const base = new Date(weekStart + 'T00:00:00');
  return DAYS.map((_, i) => {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    return d.toISOString().split('T')[0];
  });
}

function calculateRowHours(entry) {
  const toMin = (t) => {
    if (!t) return null;
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };

  const start = toMin(entry.start);
  const lout  = toMin(entry.lunchOut);
  const lin   = toMin(entry.lunchIn);
  const end   = toMin(entry.end);

  // Case 1: Full day (Start + LunchOut + LunchIn + End)
  if (start !== null && lout !== null && lin !== null && end !== null) {
    const amMin = (lout > start) ? (lout - start) : 0;
    const pmMin = (end > lin) ? (end - lin) : 0;
    return (amMin + pmMin) / 60;
  }

  // Case 2: No lunch (Start + End only)
  if (start !== null && end !== null && end > start) {
    return (end - start) / 60;
  }

  // Case 3: Afternoon only (LunchIn + End)
  if (lin !== null && end !== null && end > lin) {
    return (end - lin) / 60;
  }

  // Case 4: Morning only (Start + LunchOut)
  if (start !== null && lout !== null && lout > start) {
    return (lout - start) / 60;
  }

  return 0;
}

export function useTimesheet() {
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState('idle');
  const [profInfo, setProfInfo] = useState({
    name: 'Luis G. Reyes Morales',
    company: 'MiniMed – Juncos',
    title: 'Sr. Quality Engineer',
    supervisor: 'Charlene González',
    projectCode: 'EQValPR',
    tsNumber: 1,
    weekStart: getMonday(),
    prevYtdGross: 0,
    prevYtdNet: 0,
    prevYtdPrWh: 0,
    prevYtdSelfEmp: 0,
    comments: '',
    profSignature: '',
    profSignDate: new Date().toISOString().split('T')[0],
    supSignature: '',
    supSignDate: new Date().toISOString().split('T')[0],
    recipientEmail: 'reyenergybroker@gmail.com',
    ccEmail: ''
  });

  const defaultDates = buildDates(profInfo.weekStart);

  const [entries, setEntries] = useState(
    DAYS.map((day, i) => ({
      day,
      date: defaultDates[i],
      start: WEEKEND_INDICES.includes(i) ? '' : '08:00',
      lunchOut: WEEKEND_INDICES.includes(i) ? '' : '12:00',
      lunchIn: WEEKEND_INDICES.includes(i) ? '' : '13:00',
      end: WEEKEND_INDICES.includes(i) ? '' : '17:00',
      description: ''
    }))
  );

  // ── LOAD INITIAL DATA (LocalStorage then Supabase) ──
  useEffect(() => {
    let active = true;
    async function init() {
      setSyncStatus('fetching');
      const saved = localStorage.getItem('minimed_app_state_v2');
      let initialProf = null;
      let initialEntries = null;

      if (saved) {
        try {
          const data = JSON.parse(saved);
          if (data.profInfo) initialProf = data.profInfo;
          if (data.entries) initialEntries = data.entries;
        } catch (e) {}
      }

      try {
        const { data: { user } } = await supabase.auth.getUser();
        const email = user?.email || profInfo.recipientEmail;
        if (email) {
          const { data: cloud } = await supabase.from('timesheets').select('payload').eq('professional_email', email).eq('payload->>weekStart', profInfo.weekStart).order('updated_at', { ascending: false }).limit(1).single();
          if (active && cloud?.payload) {
            initialProf = { ...initialProf, ...cloud.payload.profInfo };
            initialEntries = cloud.payload.entries;
            setSyncStatus('saved');
          }
        }
      } catch (e) {} finally {
        if (active) setLoading(false);
      }

      if (!active) return;
      if (initialProf) setProfInfo(prev => ({ ...prev, ...initialProf }));
      
      const dates = buildDates(profInfo.weekStart);
      if (initialEntries && Array.isArray(initialEntries) && initialEntries.length === 7) {
        setEntries(initialEntries.map((e, i) => ({ ...e, date: dates[i] })));
      } else {
        setEntries(prev => prev.map((e, i) => ({ ...e, date: dates[i] })));
      }
      if (syncStatus === 'fetching') setSyncStatus('idle');
    }
    init();
    return () => { active = false; };
  }, [profInfo.weekStart]);

  // Hook 6: Placeholder to maintain same number of hooks as previous version to avoid HMR issues
  useEffect(() => {}, []);

  // ── WEEK NUMBER (calculated from 03/30/2026 = Week 1) ──
  const weekNumber = useMemo(() => {
    if (!profInfo.weekStart) return 1;
    const current = new Date(profInfo.weekStart + 'T00:00:00');
    const diffMs = current - WEEK_ONE_START;
    const diffWeeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000));
    return Math.max(1, diffWeeks + 1);
  }, [profInfo.weekStart]);

  // ── NAVIGATE WEEKS ──
  const navigateWeek = (direction) => {
    const currentStart = new Date(profInfo.weekStart + 'T00:00:00');
    currentStart.setDate(currentStart.getDate() + (direction * 7));
    const newWeekStart = currentStart.toISOString().split('T')[0];

    // Reset weekly fields and set weekStart. 
    // The useEffect(..., [weekStart]) will handle data fetching and entry population.
    setProfInfo(prev => ({
      ...prev,
      weekStart: newWeekStart,
      comments: '',
      profSignature: '',
      supSignature: ''
    }));
  };

  const rolloverNewWeek = () => navigateWeek(1);
  const rolloverPrevWeek = () => navigateWeek(-1);

  // ── DERIVED CALCULATIONS (useMemo = no infinite loops) ──
  const entriesWithHours = useMemo(() => {
    return entries.map(e => ({
      ...e,
      hours: calculateRowHours(e)
    }));
  }, [entries]);

  const totals = useMemo(() => {
    const totalHours = entriesWithHours.reduce((acc, e) => acc + e.hours, 0);
    const gross = totalHours * RATE;

    const prevGross = parseFloat(profInfo.prevYtdGross) || 0;
    const prevNet = parseFloat(profInfo.prevYtdNet) || 0;
    const prevPrWh = parseFloat(profInfo.prevYtdPrWh) || 0;
    const prevSelfEmp = parseFloat(profInfo.prevYtdSelfEmp) || 0;
    const totalYtdGross = prevGross + gross;

    const prSubject = Math.max(0, totalYtdGross - Math.max(EXEMPT_LIMIT, prevGross));
    const prWh = prSubject * PR_WH_RATE;
    const ss = gross * SS_RATE;
    const medicare = gross * MEDICARE_RATE;
    const totalRet = prWh + ss + medicare;
    const net = gross - totalRet;

    return {
      totalHours: totalHours.toFixed(2),
      grossPay: gross,
      prWh,
      ss,
      medicare,
      estimatedSelfEmp: ss + medicare,
      totalRet,
      netPay: net,
      newYtdGross: totalYtdGross,
      newYtdNet: prevNet + net,
      newYtdPrWh: prevPrWh + prWh,
      newYtdSelfEmp: prevSelfEmp + ss + medicare,
      selfEmpPercentOfNet: net > 0 ? ((ss + medicare) / net) * 100 : 0,
      effectiveRate: gross > 0 ? (totalRet / gross) * 100 : 0
    };
  }, [entriesWithHours, profInfo.prevYtdGross, profInfo.prevYtdNet, profInfo.prevYtdPrWh, profInfo.prevYtdSelfEmp]);

  // ── SAVE TO LOCAL STORAGE + TRIGGER SYNC ──
  useEffect(() => {
    if (loading || syncStatus === 'fetching') return; // Don't save while loading or fetching
    localStorage.setItem('minimed_app_state_v2', JSON.stringify({ profInfo, entries }));
    setSyncStatus('pending');
  }, [entries, profInfo, loading]);

  // ── SUPABASE SYNC (debounced) ──
  const performSync = async () => {
    if (loading) return;
    setSyncStatus('syncing');
    try {
      const email = profInfo.recipientEmail;
      if (!email) return;

      const payload = { 
        profInfo, 
        entries: entriesWithHours, 
        totals, 
        generatedAt: new Date().toISOString(),
        weekStart: profInfo.weekStart
      };

      const { data: existing } = await supabase.from('timesheets').select('id').eq('professional_email', email).eq('payload->>weekStart', profInfo.weekStart).limit(1);

      if (existing && existing.length > 0) {
        await supabase.from('timesheets').update({ payload, updated_at: new Date().toISOString() }).eq('id', existing[0].id);
      } else {
        await supabase.from('timesheets').insert([{ payload, professional_email: email, updated_at: new Date().toISOString() }]);
      }
      setSyncStatus('saved');
    } catch (e) {
      setSyncStatus('error');
    }
  };

  // ── SUPABASE SYNC (debounced) ──
  const syncTimer = useRef(null);
  useEffect(() => {
    if (loading || syncStatus === 'fetching') return;
    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(performSync, 2000);
    return () => clearTimeout(syncTimer.current);
  }, [profInfo, entries]);

  const forceSync = async () => {
    if (syncTimer.current) clearTimeout(syncTimer.current);
    await performSync();
  };

  return {
    profInfo, setProfInfo,
    entries: entriesWithHours,
    setEntries,
    totals,
    syncStatus,
    loading,
    weekNumber,
    rolloverNewWeek,
    rolloverPrevWeek,
    forceSync
  };
}
