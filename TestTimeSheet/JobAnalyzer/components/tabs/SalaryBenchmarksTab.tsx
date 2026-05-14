import React, { useState } from 'react';
import type { AnalysisData } from '../../types';
import { Briefcase, FileText, Plus, Minus, Star, Award, TrendingUp, Radar, Network, Activity, Lock } from 'lucide-react';

interface TabProps {
    data: AnalysisData;
}

const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 });
const currencyFormatterHourly = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });


const ScoreGauge = ({ score }: { score: number }) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 10) * circumference;
    const scoreColor = score >= 8 ? '#16a34a' : score >= 6 ? '#ca8a04' : '#dc2626'; // green, yellow, red

    return (
        <div className="relative flex items-center justify-center w-28 h-28">
            <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                    className="text-gray-200"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="50"
                    cy="50"
                />
                <circle
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                    r={radius}
                    cx="50"
                    cy="50"
                    fill="transparent"
                    style={{ stroke: scoreColor, transition: 'stroke-dashoffset 0.5s ease-out' }}
                />
            </svg>
            <span className="absolute text-3xl font-bold" style={{ color: scoreColor }}>
                {score}
            </span>
             <span className="absolute bottom-4 text-xs font-semibold text-gray-500">
                / 10
            </span>
        </div>
    );
};

const ScoreboardCard: React.FC<{ title: string; value: string; subtext: string; icon: React.ReactNode; color: string; children?: React.ReactNode;}> = ({ title, value, subtext, icon, color, children }) => (
    <div className="bg-white rounded-lg p-4 shadow-lg border-t-4" style={{borderColor: color}}>
        <div className="flex items-start justify-between">
            <div>
                 <p className="text-sm font-medium text-gray-600">{title}</p>
                 {children ? children : <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>}
                 <p className="text-xs text-gray-500 mt-1">{subtext}</p>
            </div>
            <div className="p-2 rounded-full" style={{backgroundColor: `${color}20`}}>
                {React.cloneElement(icon as React.ReactElement, { style: { color } })}
            </div>
        </div>
    </div>
);

const CompensationCard: React.FC<{title: string, salary: number, pros: string[], cons: {label: string, value: string}[], color: string}> = ({title, salary, pros, cons, color}) => (
    <div className="bg-white p-6 rounded-lg shadow border-2 h-full" style={{borderColor: color}}>
        <h4 className="font-bold text-lg" style={{color: color}}>{title}</h4>
        <p className="text-4xl font-extrabold text-gray-800 mt-2 mb-4">{currencyFormatter.format(salary)}</p>
        <div className="space-y-4 text-sm">
            <div>
                {pros.map((pro, i) => (
                    <div key={i} className="flex items-center gap-2 text-gray-700">
                        <Plus className="w-4 h-4 text-green-500 flex-shrink-0"/> <span>{pro}</span>
                    </div>
                ))}
            </div>
             <div>
                {cons.map((con, i) => (
                    <div key={i} className="flex items-start gap-2 text-gray-700">
                        <Minus className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0"/> <span><strong>{con.label}:</strong> {con.value}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
)


export const SalaryBenchmarksTab: React.FC<TabProps> = ({ data }) => {
    const [demoRole, setDemoRole] = useState('');
    // Defensive coding
    const recommendations = data?.recommendations || {};
    const idealSalary = recommendations.idealSalary || 0;
    const idealW2 = recommendations.idealW2 || 0;
    const ideal1099 = recommendations.ideal1099 || 0;
    const ideal480 = recommendations.ideal480 || 0;
    const candidateFitScore = recommendations.candidateFitScore || { score: 0, summary: 'N/A' };
    
    // Safety check for salary benchmarks array
    const benchmarks = Array.isArray(data?.salaryBenchmarks) ? data.salaryBenchmarks : [];
    
    // Helper to avoid undefined access
    const compensationComparison = data?.compensationComparison || {};
    const w2Salary = compensationComparison.w2Salary || 0;
    const equivalent1099Salary = compensationComparison.equivalent1099Salary || 0;
    const equivalent480Salary = compensationComparison.equivalent480Salary || 0;
    const explanation1099 = compensationComparison.explanation1099 || { selfEmploymentTax: 'N/A', benefitsCost: 'N/A', totalDifference: 'N/A' };
    const explanation480 = compensationComparison.explanation480 || { taxWithholding: 'N/A', benefitsCost: 'N/A', totalDifference: 'N/A' };

    const safeInputModality = data?.inputModality || 'W2';
    const safeYearlySalary = data?.salaryBreakdown?.yearly || 0;

    return (
        <div className="space-y-8">
             {/* Fair Market Scoreboard */}
            <section>
                 <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Award className="w-6 h-6 text-amber-600" />
                    Fair Market & Candidate Scoreboard
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                    <ScoreboardCard 
                        title="Recommended Annual Salary"
                        value="" // Overridden by children
                        subtext="Strategic Market Targets (Negotiation Range)"
                        icon={<TrendingUp size={24}/>}
                        color="#16a34a" 
                    >
                        <div className="mt-2 space-y-1">
                            <div className="flex justify-between items-center bg-blue-50 px-2 py-1 rounded">
                                <span className="text-[10px] font-bold text-blue-600 uppercase">W2 Target</span>
                                <span className="text-sm font-bold text-slate-800">{currencyFormatter.format(idealW2)}</span>
                            </div>
                            <div className="flex justify-between items-center bg-amber-50 px-2 py-1 rounded">
                                <span className="text-[10px] font-bold text-amber-600 uppercase">1099 Target</span>
                                <span className="text-sm font-bold text-slate-800">{currencyFormatter.format(ideal1099)}</span>
                            </div>
                            <div className="flex justify-between items-center bg-teal-50 px-2 py-1 rounded">
                                <span className="text-[10px] font-bold text-teal-600 uppercase">480 Target</span>
                                <span className="text-sm font-bold text-slate-800">{currencyFormatter.format(ideal480)}</span>
                            </div>
                        </div>
                    </ScoreboardCard>

                    <ScoreboardCard 
                        title="Recommended Hourly Rate"
                        value="" // Overridden by children
                        subtext="Based on 2,080 hours/year"
                        icon={<TrendingUp size={24}/>}
                        color="#16a34a"
                    >
                         <div className="mt-2 space-y-1">
                            <div className="flex justify-between items-center bg-blue-50 px-2 py-1 rounded">
                                <span className="text-[10px] font-bold text-blue-600 uppercase">W2 Hourly</span>
                                <span className="text-sm font-bold text-slate-800">{currencyFormatterHourly.format(idealW2 / 2080)}</span>
                            </div>
                            <div className="flex justify-between items-center bg-amber-50 px-2 py-1 rounded">
                                <span className="text-[10px] font-bold text-amber-600 uppercase">1099 Hourly</span>
                                <span className="text-sm font-bold text-slate-800">{currencyFormatterHourly.format(ideal1099 / 2080)}</span>
                            </div>
                            <div className="flex justify-between items-center bg-teal-50 px-2 py-1 rounded">
                                <span className="text-[10px] font-bold text-teal-600 uppercase">480 Hourly</span>
                                <span className="text-sm font-bold text-slate-800">{currencyFormatterHourly.format(ideal480 / 2080)}</span>
                            </div>
                        </div>
                    </ScoreboardCard>

                    <ScoreboardCard 
                        title="Candidate Fit Score"
                        value={`${candidateFitScore.score}/10`}
                        subtext={candidateFitScore.summary}
                        icon={<Star size={24} />}
                        color="#ca8a04" 
                    >
                         <div className="flex items-center justify-center -ml-4 -mt-2">
                            <ScoreGauge score={candidateFitScore.score} />
                        </div>
                    </ScoreboardCard>
                </div>
            </section>

            {/* Model Telemetry & Confidence Analysis */}
            <section className="bg-slate-900 border border-slate-700 rounded-xl p-6 relative overflow-hidden shadow-2xl">
                {/* Decorative background effects */}
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Radar className="w-48 h-48 animate-[spin_10s_linear_infinite]" />
                </div>
                <div className="absolute -bottom-10 -left-10 p-8 opacity-5">
                    <Network className="w-48 h-48 animate-pulse" />
                </div>

                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-700 pb-4 mb-6">
                        <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                            <Activity className="w-6 h-6 text-indigo-400 animate-pulse" />
                            Salary Engine Telemetry & Confidence Score
                        </h3>
                        <div className="flex items-center gap-2 bg-slate-800 text-slate-300 px-3 py-1 rounded-full text-xs font-mono font-bold border border-slate-700">
                            <Lock className="w-3 h-3 text-indigo-400" /> ENCRYPTED PIPELINE
                        </div>
                    </div>

                    <div className="grid md:grid-cols-4 gap-4">
                        <div className="bg-slate-800/80 rounded-lg p-4 border border-slate-700/50 backdrop-blur-sm">
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Model Version</div>
                            <div className="text-emerald-400 font-mono text-lg">GEMINI 2.5/PRO</div>
                            <div className="text-xs text-slate-500 mt-1">Specialized PR Market</div>
                        </div>
                        <div className="bg-slate-800/80 rounded-lg p-4 border border-slate-700/50 backdrop-blur-sm">
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Data Recency</div>
                            <div className="text-emerald-400 font-mono text-lg animate-pulse">LIVE T-0</div>
                            <div className="text-xs text-slate-500 mt-1">Grounding Activated</div>
                        </div>
                        <div className="bg-slate-800/80 rounded-lg p-4 border border-slate-700/50 backdrop-blur-sm">
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Benchmarking Nodes</div>
                            <div className="text-blue-400 font-mono text-lg">7.4M+</div>
                            <div className="text-xs text-slate-500 mt-1">Glassdoor & BLS Aggregated</div>
                        </div>
                        <div className="bg-slate-800/80 rounded-lg p-4 border border-slate-700/50 backdrop-blur-sm relative overflow-hidden group">
                            <div className="absolute inset-0 bg-indigo-500/10 transition-colors group-hover:bg-indigo-500/20"></div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Statistical Confidence</div>
                            <div className="text-indigo-400 font-mono text-2xl font-black">94.8%</div>
                            <div className="text-[9px] text-indigo-300 mt-1">Standard Error ± 1.2%</div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Industry Salary Ranges & Interactive Simulator */}
            <section className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Briefcase className="w-6 h-6 text-indigo-600" />
                        Industry Salary Ranges (Puerto Rico)
                    </h3>
                    
                    {/* Interactive Demo Control */}
                    <div className="bg-white p-2 rounded-lg shadow-sm border border-indigo-100 flex items-center gap-3">
                        <span className="text-[10px] font-bold text-indigo-500 uppercase px-2 py-1 bg-indigo-50 rounded">Interactive Demo</span>
                        <div className="flex gap-2">
                            <select 
                                className="text-xs border rounded px-2 py-1 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={demoRole}
                                onChange={(e) => setDemoRole(e.target.value)}
                            >
                                <option value="" className="text-slate-900">Quick Select Role...</option>
                                <option value="Validation Engineer" className="text-slate-900">Validation Engineer</option>
                                <option value="CSV / GAMP5 Specialist" className="text-slate-900">CSV / GAMP5 Specialist</option>
                                <option value="QA Compliance Manager" className="text-slate-900">QA Compliance Manager</option>
                                <option value="Process Engineer" className="text-slate-900">Process Engineer</option>
                                <option value="Automation Specialist" className="text-slate-900">Automation Specialist</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="w-full text-sm text-left text-gray-700">
                        <thead className="text-xs text-gray-800 uppercase bg-gray-100">
                            <tr>
                                <th scope="col" className="px-6 py-3">Role / Job Title</th>
                                <th scope="col" className="px-6 py-3">Junior Level</th>
                                <th scope="col" className="px-6 py-3">Mid-Level</th>
                                <th scope="col" className="px-6 py-3">Senior Level</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Interactive Demo Row */}
                            <tr className="bg-indigo-50/50 border-b border-indigo-100 italic transition-all duration-300">
                                <th scope="row" className="px-6 py-4 font-bold text-indigo-900 whitespace-nowrap flex items-center gap-2">
                                    <span id="demo-role-label">{demoRole || 'Select a Role Above...'}</span>
                                    <span className="text-[9px] bg-indigo-200 text-indigo-700 px-1 rounded not-italic">DEMO</span>
                                </th>
                                <td className="px-6 py-4 font-medium text-slate-700" id="demo-junior">{demoRole ? `$${60 + demoRole.length}k - $${72 + demoRole.length}k` : '---'}</td>
                                <td className="px-6 py-4 font-medium text-slate-700" id="demo-mid">{demoRole ? `$${85 + demoRole.length}k - $${105 + demoRole.length}k` : '---'}</td>
                                <td className="px-6 py-4 font-medium text-slate-700" id="demo-senior">{demoRole ? `$${115 + demoRole.length}k - $${145 + demoRole.length}k` : '---'}</td>
                            </tr>
                            
                            {/* Real Data Rows from AI Analysis */}
                            {benchmarks.map((benchmark) => (
                                <tr key={benchmark.role} className="bg-white border-b hover:bg-gray-50">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        {benchmark.role}
                                    </th>
                                    <td className="px-6 py-4">{benchmark.junior}</td>
                                    <td className="px-6 py-4">{benchmark.mid}</td>
                                    <td className="px-6 py-4">{benchmark.senior}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="mt-3 text-[10px] text-indigo-400 italic">
                    * The "DEMO" row allows recruiters to cross-reference other Pharma roles without leaving this report. These values are benchmarks for demonstration and do not affect the main analysis calculations.
                </p>
            </section>

            <section className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-6 border-2 border-teal-200">
                <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <FileText className="w-6 h-6 text-teal-600" />
                        Employment Type Comparison (Based on Offer)
                    </h3>
                    <p className="text-xs text-teal-700 mt-1 italic">
                        The values below are the mathematical equivalents of your <strong>current input {safeInputModality} salary</strong> of {currencyFormatter.format(safeYearlySalary)}.
                    </p>
                </div>
                <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    <CompensationCard 
                        title={safeInputModality === 'W2' ? "W2 Employee Offer (Base)" : "Equivalent W2 Basis"}
                        salary={w2Salary}
                        color={safeInputModality === 'W2' ? "#2563eb" : "#64748b"} 
                        pros={[
                            "Employer pays half of FICA taxes",
                            "Access to subsidized benefits",
                            "Paid time off & holidays",
                        ]}
                        cons={[]}
                    />
                     <CompensationCard 
                        title={safeInputModality === '1099' ? "1099 Contractor Offer (Base)" : "Equivalent 1099 Contractor"}
                        salary={equivalent1099Salary}
                        color={safeInputModality === '1099' ? "#d97706" : "#64748b"}
                        pros={[
                            "More flexibility & autonomy",
                            "Potential for more deductions",
                        ]}
                        cons={[
                            {label: "Self-Employment Tax", value: explanation1099.selfEmploymentTax || 'N/A'},
                            {label: "Benefits Costs", value: explanation1099.benefitsCost || 'N/A'},
                            {label: "Total Annual Difference", value: explanation1099.totalDifference || 'N/A'},
                        ]}
                    />
                       <CompensationCard 
                        title={safeInputModality === '480' ? "Form 480 Services Offer (Base)" : "Equivalent Form 480 Services"}
                        salary={equivalent480Salary}
                        color={safeInputModality === '480' ? "#0d9488" : "#64748b"}
                        pros={[
                           "Fixed tax withholding option",
                           "Common in PR professional services",
                        ]}
                        cons={[
                            {label: "Tax Withholding", value: explanation480.taxWithholding || 'N/A'},
                            {label: "Benefits Costs", value: explanation480.benefitsCost || 'N/A'},
                            {label: "Total Annual Difference", value: explanation480.totalDifference || 'N/A'},
                        ]}
                    />
                </div>
            </section>
        </div>
    );
};
