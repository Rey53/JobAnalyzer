import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
  Wallet, 
  Percent, 
  Settings, 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  Calendar, 
  DollarSign, 
  Lightbulb, 
  TrendingUp, 
  ChevronDown, 
  ChevronUp,
  HelpCircle,
  Activity,
  Briefcase,
  MapPin,
  Shield,
  Heart,
  Laptop,
  ArrowRight,
  BookOpen
} from 'lucide-react';

// PR Tax Rates Constants
const RATE = 53; // Timesheet default hourly rate
const PR_WH_RATE = 0.10;
const SS_RATE = 0.124;
const MEDICARE_RATE = 0.029;
const SE_TAX_COMBINED = SS_RATE + MEDICARE_RATE; // 15.3%
const EXEMPT_LIMIT = 500;

interface Spend {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

interface TaxDashboardTabProps {
  isDarkMode: boolean;
}

export const TaxDashboardTab: React.FC<TaxDashboardTabProps> = ({ isDarkMode }) => {
  // --- STATES ---
  const [hasTimesheet, setHasTimesheet] = useState<boolean>(false);
  const [isOverrideMode, setIsOverrideMode] = useState<boolean>(false);
  const [showOverridePanel, setShowOverridePanel] = useState<boolean>(false);
  const [isAct60, setIsAct60] = useState<boolean>(false);
  
  // Spend Form state
  const [spends, setSpends] = useState<Spend[]>([]);
  const [spendDesc, setSpendDesc] = useState<string>('');
  const [spendAmount, setSpendAmount] = useState<string>('');
  const [spendCategory, setSpendCategory] = useState<string>('Utilities/LUMA Electricity');
  const [spendDate, setSpendDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Income Overrides
  const [overrideHourlyRate, setOverrideHourlyRate] = useState<number>(RATE);
  const [overrideWeeklyHours, setOverrideWeeklyHours] = useState<number>(40);
  const [overridePrevGross, setOverridePrevGross] = useState<number>(39723.50);
  const [overridePrevNet, setOverridePrevNet] = useState<number>(29723.45);
  const [overridePrevPrWh, setOverridePrevPrWh] = useState<number>(3922.35);
  const [overridePrevSelfEmp, setOverridePrevSelfEmp] = useState<number>(6077.70);

  // Timesheet state (loaded from local storage)
  const [timesheetProfInfo, setTimesheetProfInfo] = useState<any>(null);
  const [timesheetWeeklyHours, setTimesheetWeeklyHours] = useState<number>(40);

  // --- UTILITY FOR HOURS CALCULATION ---
  const calculateRowHours = (entry: any) => {
    const toMin = (t: string) => {
      if (!t) return null;
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    };

    const start = toMin(entry.start);
    const lout = toMin(entry.lunchOut);
    const lin = toMin(entry.lunchIn);
    const end = toMin(entry.end);

    if (start !== null && lout !== null && lin !== null && end !== null) {
      const amMin = (lout > start) ? (lout - start) : 0;
      const pmMin = (end > lin) ? (end - lin) : 0;
      return (amMin + pmMin) / 60;
    }

    if (start !== null && end !== null && end > start) {
      return (end - start) / 60;
    }

    if (lin !== null && end !== null && end > lin) {
      return (end - lin) / 60;
    }

    if (start !== null && lout !== null && lout > start) {
      return (lout - start) / 60;
    }

    return 0;
  };

  // --- INITIAL DATA LOAD ---
  const loadTimesheetData = () => {
    const saved = localStorage.getItem('minimed_app_state_v2');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.profInfo) {
          setTimesheetProfInfo(data.profInfo);
          
          // Sync overrides with actual values initially
          setOverridePrevGross(parseFloat(data.profInfo.prevYtdGross) || 0);
          setOverridePrevNet(parseFloat(data.profInfo.prevYtdNet) || 0);
          setOverridePrevPrWh(parseFloat(data.profInfo.prevYtdPrWh) || 0);
          setOverridePrevSelfEmp(parseFloat(data.profInfo.prevYtdSelfEmp) || 0);
        }
        
        if (data.entries && Array.isArray(data.entries)) {
          const hours = data.entries.reduce((acc: number, entry: any) => acc + calculateRowHours(entry), 0);
          setTimesheetWeeklyHours(hours);
          setOverrideWeeklyHours(hours);
        }
        
        setHasTimesheet(true);
      } catch (e) {
        console.error('Error loading timesheet data', e);
        setHasTimesheet(false);
      }
    } else {
      setHasTimesheet(false);
    }
  };

  useEffect(() => {
    loadTimesheetData();
    
    // Load spends
    const savedSpends = localStorage.getItem('pharmapace_spends');
    if (savedSpends) {
      try {
        setSpends(JSON.parse(savedSpends));
      } catch (e) {
        console.error('Error parsing spends', e);
      }
    }
  }, []);

  // Sync spends to localstorage
  useEffect(() => {
    localStorage.setItem('pharmapace_spends', JSON.stringify(spends));
  }, [spends]);

  // Load demo data helper
  const handleLoadDemoData = () => {
    const demoProfInfo = {
      name: 'Luis G. Reyes Morales',
      company: 'MiniMed - Juncos',
      title: 'Sr. Quality Engineer',
      weekStart: '2026-03-30',
      prevYtdGross: 39723.50,
      prevYtdNet: 29723.45,
      prevYtdPrWh: 3922.35,
      prevYtdSelfEmp: 6077.70,
    };
    
    setTimesheetProfInfo(demoProfInfo);
    setTimesheetWeeklyHours(40);
    setHasTimesheet(true);
    
    // Set overrides
    setOverrideHourlyRate(53);
    setOverrideWeeklyHours(40);
    setOverridePrevGross(39723.50);
    setOverridePrevNet(29723.45);
    setOverridePrevPrWh(3922.35);
    setOverridePrevSelfEmp(6077.70);

    // Populate standard spends for preview
    if (spends.length === 0) {
      setSpends([
        { id: '1', description: 'Monthly Gas (Work commute)', amount: 180, category: 'Commute/Gas/Tolls', date: '2026-03-31' },
        { id: '2', description: 'LUMA Energy (Home office electricity)', amount: 280, category: 'Utilities/LUMA Electricity', date: '2026-04-01' },
        { id: '3', description: 'CIAPR Annual Professional Membership', amount: 150, category: 'Professional Fees/CIAPR', date: '2026-04-05' },
        { id: '4', description: 'ASQ Certification Exam Prep Course', amount: 350, category: 'Equipment/Software', date: '2026-04-10' }
      ]);
    }
  };

  // --- INCOME CALCULATIONS ---
  const activeIncome = useMemo(() => {
    let rate = RATE;
    let hours = 40;
    let prevGross = 39723.50;
    let prevNet = 29723.45;
    let prevPrWh = 3922.35;
    let prevSelfEmp = 6077.70;

    if (isOverrideMode) {
      rate = overrideHourlyRate;
      hours = overrideWeeklyHours;
      prevGross = overridePrevGross;
      prevNet = overridePrevNet;
      prevPrWh = overridePrevPrWh;
      prevSelfEmp = overridePrevSelfEmp;
    } else if (hasTimesheet && timesheetProfInfo) {
      rate = RATE; // Standard contract rate
      hours = timesheetWeeklyHours;
      prevGross = parseFloat(timesheetProfInfo.prevYtdGross) || 0;
      prevNet = parseFloat(timesheetProfInfo.prevYtdNet) || 0;
      prevPrWh = parseFloat(timesheetProfInfo.prevYtdPrWh) || 0;
      prevSelfEmp = parseFloat(timesheetProfInfo.prevYtdSelfEmp) || 0;
    }

    const weeklyGross = hours * rate;
    const ytdGross = prevGross + weeklyGross;

    // Retentions calculation (withholding at source by client)
    const prSubject = Math.max(0, ytdGross - Math.max(EXEMPT_LIMIT, prevGross));
    const weeklyPrWh = prSubject * PR_WH_RATE;
    const weeklySS = weeklyGross * SS_RATE;
    const weeklyMed = weeklyGross * MEDICARE_RATE;
    const weeklySelfEmp = weeklySS + weeklyMed;
    
    const weeklyRetentions = weeklyPrWh + weeklySelfEmp;
    const weeklyNetPay = weeklyGross - weeklyRetentions;

    const ytdPrWh = prevPrWh + weeklyPrWh;
    const ytdSelfEmp = prevSelfEmp + weeklySelfEmp;
    const ytdRetentions = ytdPrWh + ytdSelfEmp;
    const ytdNetPay = prevNet + weeklyNetPay;

    return {
      rate,
      hours,
      weeklyGross,
      weeklyPrWh,
      weeklySelfEmp,
      weeklyNetPay,
      prevGross,
      prevNet,
      prevPrWh,
      prevSelfEmp,
      ytdGross,
      ytdNetPay,
      ytdPrWh,
      ytdSelfEmp,
      ytdRetentions
    };
  }, [
    isOverrideMode, hasTimesheet, timesheetProfInfo, timesheetWeeklyHours,
    overrideHourlyRate, overrideWeeklyHours, overridePrevGross, overridePrevNet, overridePrevPrWh, overridePrevSelfEmp
  ]);

  // --- SPENDS / EXPENSES CALCULATIONS ---
  const totalSpends = useMemo(() => {
    return spends.reduce((acc, s) => acc + s.amount, 0);
  }, [spends]);

  const spendsByCategory = useMemo(() => {
    const groups: Record<string, number> = {};
    spends.forEach(s => {
      groups[s.category] = (groups[s.category] || 0) + s.amount;
    });
    return groups;
  }, [spends]);

  // --- TAX MATH ENGINE ---
  // Calculates PR Income Tax under progressive schedule or flat Act 60
  const calculatePRTax = (taxableIncome: number, flatAct60: boolean) => {
    if (flatAct60) {
      return taxableIncome * 0.04;
    }
    
    if (taxableIncome <= 9000) return 0;
    if (taxableIncome <= 25000) return (taxableIncome - 9000) * 0.07;
    if (taxableIncome <= 41500) return 1120 + (taxableIncome - 25000) * 0.11;
    if (taxableIncome <= 61500) return 2935 + (taxableIncome - 41500) * 0.15;
    return 5935 + (taxableIncome - 61500) * 0.33;
  };

  // YTD Tax Liability Analysis (Comparing Withholding vs. Actual Liability)
  const taxAnalysis = useMemo(() => {
    const grossIncome = activeIncome.ytdGross;
    
    // 1. WITHOUT EXPENSES (Baselines)
    const basePrTaxLiability = calculatePRTax(grossIncome, isAct60);
    // SE tax is filed on 92.35% of net self-employment earnings for Form 1040-PR
    const baseSeTaxLiability = grossIncome * 0.9235 * SE_TAX_COMBINED;
    const baseTotalTaxLiability = basePrTaxLiability + baseSeTaxLiability;

    // 2. WITH EXPENSES (Optimized)
    const optimizedTaxableIncome = Math.max(0, grossIncome - totalSpends);
    const optimizedPrTaxLiability = calculatePRTax(optimizedTaxableIncome, isAct60);
    const optimizedSeTaxLiability = optimizedTaxableIncome * 0.9235 * SE_TAX_COMBINED;
    const optimizedTotalTaxLiability = optimizedPrTaxLiability + optimizedSeTaxLiability;

    // 3. SAVINGS
    const prTaxSavings = Math.max(0, basePrTaxLiability - optimizedPrTaxLiability);
    const seTaxSavings = Math.max(0, baseSeTaxLiability - optimizedSeTaxLiability);
    const totalTaxSavings = prTaxSavings + seTaxSavings;

    // 4. REFUND / BALANCE DUE ESTIMATION (PR HACIENDA ONLY)
    // The user has prepaid taxes via 10% withholding.
    const paidPrWh = activeIncome.ytdPrWh;
    // Estimated Refund = Paid Withholding - Actual Liability
    const prRefundBalance = paidPrWh - optimizedPrTaxLiability;

    // 5. FEDERAL SELF-EMPLOYMENT TAX REFUND / BALANCE DUE
    // The user has paid weekly SE taxes (FICA/Medicare retentions) of 15.3% of 100% of gross
    const paidSeTax = activeIncome.ytdSelfEmp;
    const seRefundBalance = paidSeTax - optimizedSeTaxLiability;

    const totalRefundBalance = prRefundBalance + seRefundBalance;

    return {
      basePrTax: basePrTaxLiability,
      baseSeTax: baseSeTaxLiability,
      baseTotalTax: baseTotalTaxLiability,
      optimizedPrTax: optimizedPrTaxLiability,
      optimizedSeTax: optimizedSeTaxLiability,
      optimizedTotalTax: optimizedTotalTaxLiability,
      prTaxSavings,
      seTaxSavings,
      totalTaxSavings,
      prRefundBalance,
      seRefundBalance,
      totalRefundBalance,
      deductionEfficiency: totalSpends > 0 ? (totalTaxSavings / totalSpends) * 100 : 0
    };
  }, [activeIncome.ytdGross, activeIncome.ytdPrWh, activeIncome.ytdSelfEmp, totalSpends, isAct60]);

  // True Net Profit (Gross - Actual Tax Liability - Expenses)
  const trueNetProfitYtd = useMemo(() => {
    return activeIncome.ytdGross - taxAnalysis.optimizedTotalTax - totalSpends;
  }, [activeIncome.ytdGross, taxAnalysis.optimizedTotalTax, totalSpends]);

  // --- ACTIONS ---
  const handleAddSpend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!spendDesc.trim() || !spendAmount || parseFloat(spendAmount) <= 0) {
      alert('Please fill out all fields with valid values.');
      return;
    }
    
    const newSpendItem: Spend = {
      id: Date.now().toString(),
      description: spendDesc.trim(),
      amount: parseFloat(spendAmount),
      category: spendCategory,
      date: spendDate
    };

    setSpends(prev => [newSpendItem, ...prev]);
    setSpendDesc('');
    setSpendAmount('');
  };

  const handleDeleteSpend = (id: string) => {
    setSpends(prev => prev.filter(s => s.id !== id));
  };

  const handleClearAllSpends = () => {
    if (window.confirm('Are you sure you want to clear all entered spends?')) {
      setSpends([]);
    }
  };

  // Formatting helpers
  const fmt = (val: number) => {
    return `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Category Icon Resolver
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Utilities/LUMA Electricity':
        return <Lightbulb className="w-4 h-4 text-amber-500" />;
      case 'Commute/Gas/Tolls':
        return <MapPin className="w-4 h-4 text-emerald-500" />;
      case 'Rent/Home Office':
        return <Briefcase className="w-4 h-4 text-indigo-500" />;
      case 'Equipment/Software':
        return <Laptop className="w-4 h-4 text-blue-500" />;
      case 'Professional Fees/CIAPR':
        return <Shield className="w-4 h-4 text-purple-500" />;
      case 'Health Insurance':
        return <Heart className="w-4 h-4 text-red-500" />;
      default:
        return <HelpCircle className="w-4 h-4 text-slate-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Utilities/LUMA Electricity': return 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-900';
      case 'Commute/Gas/Tolls': return 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900';
      case 'Rent/Home Office': return 'bg-indigo-100 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900';
      case 'Equipment/Software': return 'bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-900';
      case 'Professional Fees/CIAPR': return 'bg-purple-100 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-900';
      case 'Health Insurance': return 'bg-red-100 dark:bg-red-950/40 text-red-800 dark:text-red-300 border-red-200 dark:border-red-900';
      default: return 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  const categories = [
    'Utilities/LUMA Electricity',
    'Commute/Gas/Tolls',
    'Rent/Home Office',
    'Equipment/Software',
    'Professional Fees/CIAPR',
    'Health Insurance',
    'Other'
  ];

  return (
    <div className="p-4 sm:p-8 space-y-8 enter-rise">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6 border-mist dark:border-slate-700">
        <div>
          <div className="flex items-center gap-2 text-reef dark:text-teal-400 font-semibold text-sm mb-1 uppercase tracking-wider font-data">
            <Percent size={16} /> Puerto Rico Tax Expert Dashboard
          </div>
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink dark:text-white">
            Income vs. Spend Tax Optimizer
          </h2>
          <p className="text-slate-550 dark:text-slate-405 text-sm max-w-2xl mt-1">
            Analyze self-employed earnings, deduct business spends (Schedule M), optimize self-employment tax (IRS 1040-PR), and project year-end refunds.
          </p>
        </div>

        {/* ACT 60 TOGGLE & CONTROLS */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsAct60(!isAct60)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all shadow-sm ${
              isAct60
                ? 'bg-coqui text-ink border-coqui font-extrabold shadow'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-shell'
            }`}
          >
            <Activity size={15} />
            {isAct60 ? 'Act 60 Decree active (4%)' : 'Standard progressive rates'}
          </button>

          <button
            onClick={() => {
              setIsOverrideMode(!isOverrideMode);
              if(!isOverrideMode) setShowOverridePanel(true);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all shadow-sm ${
              isOverrideMode
                ? 'bg-ink dark:bg-white text-white dark:text-ink border-ink dark:border-white'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-shell'
            }`}
          >
            <Settings size={15} />
            {isOverrideMode ? 'Income Overridden' : 'Simulate Income'}
          </button>
        </div>
      </div>

      {/* DATA INTEGRATION STATUS BANNER */}
      <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
        hasTimesheet 
          ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/60' 
          : 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/60'
      }`}>
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-xl mt-0.5 ${
            hasTimesheet ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400' : 'bg-amber-100 dark:bg-amber-900/40 text-amber-600'
          }`}>
            {hasTimesheet ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
              {hasTimesheet 
                ? `Successfully connected to timesheet: minimed_app_state_v2` 
                : `No timesheet data detected in LocalStorage`}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
              {hasTimesheet 
                ? `Imported profile: ${timesheetProfInfo?.name || 'Luis Reyes'} (${timesheetProfInfo?.title || 'Contractor'}) at ${timesheetProfInfo?.company || 'MiniMed'}. Active week: ${activeIncome.hours} hrs @ $${activeIncome.rate}/hr.`
                : `We could not find active timesheet inputs in this browser. You can load demo timesheet data ($2,120/wk gross) to see the full dashboard analysis immediately.`}
            </p>
          </div>
        </div>
        
        {!hasTimesheet && (
          <button
            onClick={handleLoadDemoData}
            className="shrink-0 bg-amber-500 hover:bg-amber-600 text-ink text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm"
          >
            Load Demo Timesheet Data
          </button>
        )}
        {hasTimesheet && (
          <button
            onClick={loadTimesheetData}
            className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm"
          >
            Refresh Timesheet Data
          </button>
        )}
      </div>

      {/* OVERRIDE SIMULATOR PANEL */}
      {isOverrideMode && showOverridePanel && (
        <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 p-6 rounded-2xl enter-rise shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Settings className="w-4 h-4 text-reef" /> Income Simulation & Overrides
            </h4>
            <button 
              onClick={() => setShowOverridePanel(false)}
              className="text-xs text-slate-400 hover:text-slate-650 dark:hover:text-slate-200"
            >
              Hide Panel
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Contract Rate ($/hr)</label>
              <input 
                type="number" 
                value={overrideHourlyRate} 
                onChange={(e) => setOverrideHourlyRate(parseFloat(e.target.value) || 0)}
                className="w-full text-sm px-3 py-2 bg-white dark:bg-slate-805 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Weekly Hours</label>
              <input 
                type="number" 
                value={overrideWeeklyHours} 
                onChange={(e) => setOverrideWeeklyHours(parseFloat(e.target.value) || 0)}
                className="w-full text-sm px-3 py-2 bg-white dark:bg-slate-805 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Prev YTD Gross ($)</label>
              <input 
                type="number" 
                value={overridePrevGross} 
                onChange={(e) => setOverridePrevGross(parseFloat(e.target.value) || 0)}
                className="w-full text-sm px-3 py-2 bg-white dark:bg-slate-805 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Prev YTD Net ($)</label>
              <input 
                type="number" 
                value={overridePrevNet} 
                onChange={(e) => setOverridePrevNet(parseFloat(e.target.value) || 0)}
                className="w-full text-sm px-3 py-2 bg-white dark:bg-slate-805 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Prev YTD Hacienda ($)</label>
              <input 
                type="number" 
                value={overridePrevPrWh} 
                onChange={(e) => setOverridePrevPrWh(parseFloat(e.target.value) || 0)}
                className="w-full text-sm px-3 py-2 bg-white dark:bg-slate-805 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Prev YTD IRS SE ($)</label>
              <input 
                type="number" 
                value={overridePrevSelfEmp} 
                onChange={(e) => setOverridePrevSelfEmp(parseFloat(e.target.value) || 0)}
                className="w-full text-sm px-3 py-2 bg-white dark:bg-slate-805 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>
          <div className="mt-3 text-[10px] text-slate-400">
            ⚠️ Overrides are temporary and simulate custom earning brackets. Toggle override mode off to return to timesheet data.
          </div>
        </div>
      )}

      {/* OVERVIEW SUMMARY CARDS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* CARD 1: GROSS PAY */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-white shadow-sm flex flex-col justify-between min-h-[140px]">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider font-data">YTD Gross Earnings</span>
            <DollarSign className="w-5 h-5 text-coqui" />
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold font-data text-coqui">{fmt(activeIncome.ytdGross)}</div>
            <div className="text-xs text-slate-400 mt-1">
              Active Week: <span className="text-emerald-400 font-semibold">{fmt(activeIncome.weeklyGross)}</span> ({activeIncome.hours} hrs)
            </div>
          </div>
        </div>

        {/* CARD 2: TOTAL RETENTIONS / TAX LIABILITIES */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-white shadow-sm flex flex-col justify-between min-h-[140px]">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider font-data">Total Tax Liabilities</span>
            <Percent className="w-5 h-5 text-red-400" />
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold font-data text-red-400">{fmt(taxAnalysis.optimizedTotalTax)}</div>
            <div className="text-xs text-slate-400 mt-1">
              Withheld YTD: <span className="text-slate-200 font-semibold">{fmt(activeIncome.ytdPrWh + activeIncome.ytdSelfEmp)}</span>
            </div>
          </div>
        </div>

        {/* CARD 3: TOTAL EXPENSES (SPENDS) */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-white shadow-sm flex flex-col justify-between min-h-[140px]">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider font-data">Total Spends / Deductions</span>
            <Wallet className="w-5 h-5 text-blue-405" />
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold font-data text-blue-405">{fmt(totalSpends)}</div>
            <div className="text-xs text-slate-400 mt-1">
              Deductible spends reported on Schedule M
            </div>
          </div>
        </div>

        {/* CARD 4: TRUE NET TAKE-HOME */}
        <div className="bg-slate-900 border border-emerald-950 p-6 rounded-2xl text-white shadow-sm flex flex-col justify-between min-h-[140px]">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider font-data">YTD True Net Take-Home</span>
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold font-data text-emerald-400">{fmt(trueNetProfitYtd)}</div>
            <div className="text-xs text-slate-400 mt-1">
              Cash remaining after actual taxes & spends
            </div>
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN DASHBOARD */}
      <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-8">
        
        {/* LEFT COLUMN: EXPENSES INPUT & LIST */}
        <div className="space-y-8">
          
          {/* SPENDS ENTRY BOX */}
          <div className="bg-white dark:bg-slate-900 border border-mist dark:border-slate-800 p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-reef" /> Introduce Business Spends
            </h3>
            
            <form onSubmit={handleAddSpend} className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Spend Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. LUMA Electricity Bill, Gas Fill-up, CIAPR fee"
                  value={spendDesc}
                  onChange={(e) => setSpendDesc(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-205 dark:border-slate-700/80 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white focus:ring-2 focus:ring-reef/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Amount ($ USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={spendAmount}
                  onChange={(e) => setSpendAmount(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-205 dark:border-slate-700/80 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-reef/20 font-data font-bold text-reef"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Spend Date
                </label>
                <input
                  type="date"
                  value={spendDate}
                  onChange={(e) => setSpendDate(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-205 dark:border-slate-700/80 rounded-xl text-slate-800 dark:text-slate-100 focus:bg-white font-data"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Category
                </label>
                <select
                  value={spendCategory}
                  onChange={(e) => setSpendCategory(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-205 dark:border-slate-700/80 rounded-xl text-slate-800 dark:text-slate-100 focus:bg-white"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-reef hover:bg-mangrove text-white font-bold py-2.5 px-4 rounded-xl transition-all shadow hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm"
                >
                  <Plus className="w-4 h-4" /> Add Business Spend
                </button>
              </div>
            </form>
          </div>

          {/* SPENDS LIST / TABLE */}
          <div className="bg-white dark:bg-slate-900 border border-mist dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-mist dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-reef" /> Deductible Spends List
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Showing all business expenses that will be reported on PR Hacienda Schedule M.
                </p>
              </div>
              
              {spends.length > 0 && (
                <button
                  onClick={handleClearAllSpends}
                  className="text-xs text-red-500 hover:text-red-700 font-semibold border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-lg transition-all"
                >
                  Clear All
                </button>
              )}
            </div>

            {spends.length === 0 ? (
              <div className="p-12 text-center text-slate-400 dark:text-slate-500">
                <Wallet className="w-10 h-10 mx-auto mb-3 opacity-30 text-slate-400" />
                <p className="font-semibold text-sm">No business spends entered yet</p>
                <p className="text-xs mt-1 max-w-sm mx-auto">
                  Add gas expense, utility payments, memberships, software subscriptions, or home office costs in the form above.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-850/50 border-b border-mist dark:border-slate-800">
                      <th className="px-6 py-3 text-xs font-bold text-slate-450 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-xs font-bold text-slate-450 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-xs font-bold text-slate-450 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-xs font-bold text-slate-450 uppercase tracking-wider text-right">Amount</th>
                      <th className="px-6 py-3 text-xs font-bold text-slate-450 uppercase tracking-wider text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {spends.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/30 transition-colors">
                        <td className="px-6 py-4 text-xs font-data text-slate-500 dark:text-slate-400">{s.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getCategoryColor(s.category)}`}>
                            {getCategoryIcon(s.category)}
                            {s.category.split('/')[0]}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-200 max-w-[200px] truncate" title={s.description}>
                          {s.description}
                        </td>
                        <td className="px-6 py-4 text-sm font-data font-bold text-slate-800 dark:text-slate-200 text-right">
                          {fmt(s.amount)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleDeleteSpend(s.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 p-2 rounded-lg transition-all"
                            aria-label="Delete expense"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: TAX SAVINGS AND OPTIMIZATION */}
        <div className="space-y-8">
          
          {/* PR TAX BREAKDOWN & REFUND / BALANCE DUE WIDGET */}
          <div className="bg-white dark:bg-slate-900 border-2 border-mist dark:border-slate-800 rounded-2xl shadow-sm p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-coqui/15 rounded-xl text-coqui">
                <Percent className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">PR Hacienda Tax Summary</h3>
                <p className="text-xs text-slate-400 mt-0.5">Year-End projection comparing withholdings to progressive liability.</p>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400 font-semibold">YTD Professional Services (Gross)</span>
                <span className="font-data font-bold text-slate-700 dark:text-slate-350">{fmt(activeIncome.ytdGross)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400 font-semibold">Minus Spends (Schedule M Deductions)</span>
                <span className="font-data font-bold text-blue-500">-{fmt(totalSpends)}</span>
              </div>
              <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between items-center text-sm font-bold">
                <span className="text-slate-700 dark:text-slate-200">Net Taxable Business Income</span>
                <span className="font-data text-reef">{fmt(Math.max(0, activeIncome.ytdGross - totalSpends))}</span>
              </div>
            </div>

            {/* PROGRESSIVE BRACKETS CALCULATOR */}
            <div className="bg-slate-50 dark:bg-slate-850/60 p-4 rounded-xl space-y-3">
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-between border-b pb-2 border-slate-200/50 dark:border-slate-700/50">
                <span>PR Income Tax Liability</span>
                <span>{isAct60 ? 'Act 60 (Flat 4%)' : 'Progressive'}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Liability without Spends:</span>
                <span className="font-data">{fmt(taxAnalysis.basePrTax)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-700 dark:text-slate-300 font-semibold">
                <span>Liability with Spends:</span>
                <span className="font-data text-slate-800 dark:text-slate-100">{fmt(taxAnalysis.optimizedPrTax)}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-emerald-600 border-t pt-2 border-slate-200/50 dark:border-slate-700/50">
                <span>Hacienda Tax Savings:</span>
                <span className="font-data">+{fmt(taxAnalysis.prTaxSavings)}</span>
              </div>
            </div>

            {/* WITHHOLDINGS & REFUND / BALANCE DUE PROGRESS BAR AND STAT */}
            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400 font-semibold">PR Tax Withheld (Prepaid via 10%)</span>
                <span className="font-data font-bold text-slate-700 dark:text-slate-350">{fmt(activeIncome.ytdPrWh)}</span>
              </div>

              {/* Progress representation */}
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between text-xs">
                  <span className="font-semibold inline-block text-slate-500">Tax Liability vs Withholding</span>
                  <span className="font-semibold inline-block text-slate-700 dark:text-slate-300">
                    {Math.round(Math.min(100, activeIncome.ytdPrWh > 0 ? (taxAnalysis.optimizedPrTax / activeIncome.ytdPrWh) * 100 : 0))}%
                  </span>
                </div>
                <div className="overflow-hidden h-2.5 text-xs flex rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    style={{ width: `${Math.min(100, activeIncome.ytdPrWh > 0 ? (taxAnalysis.optimizedPrTax / activeIncome.ytdPrWh) * 100 : 0)}%` }}
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-505 ${
                      taxAnalysis.optimizedPrTax <= activeIncome.ytdPrWh ? 'bg-emerald-500' : 'bg-red-500'
                    }`}
                  />
                </div>
              </div>

              {/* Refund Box */}
              <div className={`p-4 rounded-xl border flex items-center justify-between ${
                taxAnalysis.prRefundBalance >= 0
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-300'
                  : 'bg-red-500/10 border-red-500/20 text-red-800 dark:text-red-300'
              }`}>
                <div>
                  <div className="text-xs uppercase font-bold tracking-wider">Estimated Hacienda Year-End Status</div>
                  <div className="text-2xl font-bold font-data mt-1">
                    {taxAnalysis.prRefundBalance >= 0 ? fmt(taxAnalysis.prRefundBalance) : fmt(Math.abs(taxAnalysis.prRefundBalance))}
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold ${
                    taxAnalysis.prRefundBalance >= 0 ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/20 text-red-500'
                  }`}>
                    {taxAnalysis.prRefundBalance >= 0 ? 'Due Refund' : 'Balance Due'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* DEDUCTION EFFICIENCY WIDGET */}
          {totalSpends > 0 && (
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-white space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" /> Deduction Optimizer Analysis
                </h4>
                <span className="text-xs bg-emerald-500/20 text-emerald-400 font-bold px-2.5 py-1 rounded-full">
                  {taxAnalysis.deductionEfficiency.toFixed(1)}% Efficient
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Every dollar you spend on your business reduces your taxable income in Puerto Rico. 
                With your spends, you save <span className="text-emerald-400 font-bold">{fmt(taxAnalysis.prTaxSavings)}</span> on PR income taxes and <span className="text-emerald-400 font-bold">{fmt(taxAnalysis.seTaxSavings)}</span> on IRS self-employment taxes.
              </p>
              <div className="border-t border-slate-800 pt-3 flex justify-between items-center text-xs">
                <span className="text-slate-400 font-semibold">Total Taxes Saved:</span>
                <span className="font-data font-bold text-emerald-400 text-sm">{fmt(taxAnalysis.totalTaxSavings)}</span>
              </div>
              <div className="text-[10px] text-slate-500 leading-relaxed pt-1">
                ℹ️ This means your business purchases have a net effective discount of {taxAnalysis.deductionEfficiency.toFixed(1)}% subsidized by tax offsets.
              </div>
            </div>
          )}

          {/* SPENDS CATEGORY DOUGHNUT RECONSTRUCTION (horizontal progress bars) */}
          <div className="bg-white dark:bg-slate-900 border border-mist dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-650 dark:text-slate-400">
              Spends Distribution by Category
            </h3>
            
            {totalSpends === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No categories to display. Add spends to see distribution.</p>
            ) : (
              <div className="space-y-4">
                {categories.map(cat => {
                  const amt = spendsByCategory[cat] || 0;
                  const pct = totalSpends > 0 ? (amt / totalSpends) * 100 : 0;
                  if (amt === 0) return null;
                  
                  return (
                    <div key={cat} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="flex items-center gap-1.5 font-semibold text-slate-705 dark:text-slate-300">
                          {getCategoryIcon(cat)}
                          {cat}
                        </span>
                        <span className="font-data text-slate-500 dark:text-slate-400 font-bold">
                          {fmt(amt)} ({Math.round(pct)}%)
                        </span>
                      </div>
                      <div className="overflow-hidden h-2 rounded bg-slate-105 dark:bg-slate-800 flex">
                        <div
                          style={{ width: `${pct}%` }}
                          className={`rounded-full ${
                            cat === 'Utilities/LUMA Electricity' ? 'bg-amber-400' :
                            cat === 'Commute/Gas/Tolls' ? 'bg-emerald-400' :
                            cat === 'Rent/Home Office' ? 'bg-indigo-400' :
                            cat === 'Equipment/Software' ? 'bg-blue-405' :
                            cat === 'Professional Fees/CIAPR' ? 'bg-purple-400' :
                            cat === 'Health Insurance' ? 'bg-red-400' : 'bg-slate-400'
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* PUERTO RICO TAX EXPERTISE BRIEF */}
          <div className="bg-slate-50 dark:bg-slate-850/60 p-5 rounded-2xl space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-reef" /> PR Tax Compliance Notes
            </h4>
            <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-2 list-disc pl-4 leading-relaxed">
              <li>
                <strong>Schedule M (Planilla)</strong>: Professional service providers report ordinary and necessary expenses (auto, home utilities, tools) on Schedule M to decrease net professional income.
              </li>
              <li>
                <strong>IRS Form 1040-PR</strong>: Filed annually for Federal Self-Employment Taxes. Expenses enter the calculation on Schedule SE, reducing the 15.3% tax liability directly.
              </li>
              <li>
                <strong>Section 1062.03 Withholding</strong>: The 10% withheld by the client is not final. It is a prepayment. Deductions reduce your tax liability below 10% in most brackets, prompting a <strong>Hacienda Refund</strong>.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
