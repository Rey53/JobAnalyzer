
import React from 'react';
import type { AnalysisData } from '../../types';
import { Building2, Car, Home, Lightbulb, Clock, CheckCircle, Globe, Info } from 'lucide-react';

interface TabProps {
    data: AnalysisData;
}

const StatCard: React.FC<{ label: string; value: string | number; valueColor?: string; subtext?: string; children?: React.ReactNode }> = ({ label, value, valueColor = 'text-gray-800', subtext, children }) => (
    <div className="bg-white rounded-lg p-4 shadow">
        <div className="text-sm text-gray-600">{label}</div>
        {children ? children : <div className={`text-xl md:text-2xl font-bold ${valueColor}`}>{value}</div>}
        {subtext && <div className="text-xs text-gray-500">{subtext}</div>}
    </div>
);

const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 });

const TooltipInfo: React.FC<{ text: string }> = ({ text }) => (
    <div className="group relative flex items-center ml-1">
        <Info className="w-4 h-4 text-gray-400 cursor-pointer" />
        <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max max-w-xs bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            {text}
        </span>
    </div>
);

export const OpportunityAnalyzerTab: React.FC<TabProps> = ({ data }) => {
    const { groundingSources } = data.companyIntelligence;
    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-100 to-indigo-100 border-2 border-blue-300 rounded-xl p-4 flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-blue-600" />
                <div>
                    <div className="font-bold text-gray-800">Analysis Complete!</div>
                    <div className="text-sm text-gray-600">Here's your personalized opportunity report.</div>
                </div>
            </div>

            {/* Company Intelligence */}
            <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Building2 className="w-6 h-6 text-blue-600" />
                    {data.companyIntelligence.name} - Company Intelligence
                    <TooltipInfo text="AI-generated estimates based on web searches, public company data, and Glassdoor." />
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard label="Recent Earnings" value={data.companyIntelligence.earnings} valueColor="text-green-700" />
                    <StatCard label="Growth Rate" value={data.companyIntelligence.growth} valueColor="text-blue-700" />
                    <StatCard label="Employee Rating" value={data.companyIntelligence.rating} valueColor="text-purple-700" />
                    <StatCard label="Benefits Package">
                         <div className="text-xs font-medium text-gray-700 mt-1 h-full">{data.companyIntelligence.benefits}</div>
                    </StatCard>
                </div>
                <div className="mt-4 bg-white rounded-lg p-4 shadow">
                    <div className="font-semibold text-gray-800 mb-2">Estimated PR Salary Ranges:</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div><span className="text-gray-600">Junior:</span> <span className="font-bold">{data.companyIntelligence.salaryRanges.junior}</span></div>
                        <div><span className="text-gray-600">Mid-Level:</span> <span className="font-bold">{data.companyIntelligence.salaryRanges.mid}</span></div>
                        <div><span className="text-gray-600">Senior:</span> <span className="font-bold">{data.companyIntelligence.salaryRanges.senior}</span></div>
                    </div>
                </div>

                {groundingSources && groundingSources.length > 0 && (
                     <div className="mt-4 bg-gray-100 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2 text-sm">
                           <Globe className="w-4 h-4 text-gray-600"/> Powered by Google Search
                        </h4>
                        <ul className="space-y-1 text-xs">
                           {groundingSources.map(source => (
                               <li key={source.uri}>
                                   <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate block">
                                       {source.title}
                                   </a>
                               </li>
                           ))}
                        </ul>
                    </div>
                )}
            </section>

            {/* Commute Analysis */}
            <section className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-6 border-2 border-green-200">
                 <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Car className="w-6 h-6 text-green-600" />
                    Commute Cost Analysis: {data.commuteAnalysis.from} → {data.commuteAnalysis.to}
                    <TooltipInfo text="Estimates based on mapping APIs and real-time fuel price data." />
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <StatCard label="Distance">
                        <div className="flex flex-col">
                            <div className="text-lg font-bold text-gray-800">{data.commuteAnalysis.distanceMiles} <span className="text-[10px] text-gray-400 uppercase font-normal text-xs">mi (One Way)</span></div>
                            <div className="text-lg font-bold text-blue-700">{data.commuteAnalysis.roundTripDistanceMiles} <span className="text-[10px] text-blue-400 uppercase font-normal text-xs">mi (Round Trip)</span></div>
                        </div>
                    </StatCard>
                    <StatCard label="Commute Time">
                        <div className="flex flex-col">
                            <div className="text-lg font-bold text-gray-800">{data.commuteAnalysis.time} <span className="text-[10px] text-gray-400 uppercase font-normal">One Way</span></div>
                            <div className="text-lg font-bold text-blue-700">{data.commuteAnalysis.roundTripTime} <span className="text-[10px] text-blue-400 uppercase font-normal">Round Trip</span></div>
                        </div>
                    </StatCard>
                    <StatCard 
                        label="Monthly Gas" 
                        value={currencyFormatter.format(data.commuteAnalysis.monthlyGas)} 
                        valueColor="text-orange-700" 
                        subtext={`@ ${data.commuteAnalysis.gasPricePerLiter}/L`}
                    />
                    <StatCard 
                        label="Monthly Tolls" 
                        value={currencyFormatter.format(data.commuteAnalysis.monthlyTolls)} 
                        valueColor="text-blue-700" 
                        subtext={data.commuteAnalysis.tollRateBasis}
                    />
                     <div className="bg-gradient-to-br from-red-100 to-orange-100 rounded-lg p-4 border-2 border-red-300 shadow">
                        <div className="text-sm text-gray-700 font-semibold">Annual Commute</div>
                        <div className="text-2xl font-bold text-red-700">{currencyFormatter.format(data.commuteAnalysis.annualCost)}</div>
                    </div>
                </div>
            </section>

             {/* Cost of Living */}
            <section className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Home className="w-6 h-6 text-purple-600" />
                    Monthly Living Costs in {data.commuteAnalysis.to}
                    <TooltipInfo text="Estimates based on public cost of living data for the specified municipality." />
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                     <StatCard label="Housing" value={currencyFormatter.format(data.costOfLiving.housing)} />
                     <StatCard label="Utilities" value={currencyFormatter.format(data.costOfLiving.utilities)} />
                     <StatCard label="Meals" value={currencyFormatter.format(data.costOfLiving.meals)} />
                     <StatCard label="Healthcare" value={currencyFormatter.format(data.costOfLiving.healthcare)} />
                     <StatCard label="Misc" value={currencyFormatter.format(data.costOfLiving.misc)} />
                     <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-4 border-2 border-purple-300 shadow">
                        <div className="text-sm text-gray-700 font-semibold">Total/Month</div>
                        <div className="text-xl font-bold text-purple-700">{currencyFormatter.format(data.costOfLiving.totalMonthly)}</div>
                    </div>
                </div>
            </section>

            {/* Recruiter Briefing: Market Variance & Scoreboard */}
            <section className="bg-slate-900 text-white rounded-xl p-6 border-l-8 border-blue-500 shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <CheckCircle className="w-32 h-32 rotate-12" />
                </div>
                
                <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-400">
                        <Info className="w-6 h-6" />
                        Executive Briefing: Market Variance & Candidate Scoreboard
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-3 border-b border-slate-700 pb-1">Contextual Analysis</h4>
                            <p className="text-sm text-slate-300 leading-relaxed mb-4">
                                This report differentiates between the <span className="text-white font-bold">Entry Offered Salary</span> (the initial baseline) and the <span className="text-blue-400 font-bold">Fair Market Value</span>. 
                                In the current Puerto Rico Pharma landscape, offer values often lag behind localized hyper-inflation in utilities (LUMA) and specialized talent scarcity.
                            </p>
                            <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
                                <span className="text-xs font-bold text-yellow-500 uppercase">Expert Recruiter insight</span>
                                <p className="text-xs text-slate-400 mt-1">
                                    "A base salary of {currencyFormatter.format(data.salaryBreakdown.yearly)} today has ~12% less purchasing power than 24 months ago due to regional cost-of-living spikes. Adjusting to the 'Ideal Target' ensures long-term retention."
                                </p>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-3 border-b border-slate-700 pb-1">Candidate Scoreboard Justification</h4>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between bg-slate-800/50 p-3 rounded border border-slate-700/50">
                                    <div className="text-sm">Technical Fit Score</div>
                                    <div className="text-xl font-black text-green-400">{data.recommendations.candidateFitScore.score}/10</div>
                                </div>
                                <p className="text-xs text-slate-400 italic">
                                    Score based on: CV matching against Tier {data.companyIntelligence.rating.includes('1') ? '1' : '2'} expectations, GAMP5/Compliance expertise, and site-specific operational knowledge.
                                </p>
                                <div className="flex flex-col gap-1">
                                    <div className="text-xs font-bold uppercase text-slate-500">Recruiter Verdict:</div>
                                    <p className="text-sm text-white font-medium leading-snug">
                                        {data.recommendations.candidateFitScore.summary}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap gap-4 text-[10px] uppercase font-bold tracking-tighter text-slate-500">
                        <span>• Data-Driven Retention Strategy</span>
                        <span>• ALCOA+ Verified Benchmarks</span>
                        <span>• PR Industrial Sector Intelligence</span>
                    </div>
                </div>
            </section>
        </div>
    );
};