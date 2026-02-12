
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
                    <StatCard label="Distance" value={data.commuteAnalysis.distance} subtext="one way" />
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

            {/* Recommendations */}
            <section className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-300">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Lightbulb className="w-6 h-6 text-yellow-600" />
                    Smart Recommendations & Salary Targets
                    <TooltipInfo text="AI-calculated recommendations based on all input factors and your provided CV." />
                </h3>
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <StatCard label="Minimum Target" value={currencyFormatter.format(data.recommendations.minTargetSalary)} valueColor="text-orange-700" subtext="To break even" />
                    <StatCard label="Ideal Salary" value={currencyFormatter.format(data.recommendations.idealSalary)} valueColor="text-green-700" subtext="For comfortable living" />
                    <StatCard label="Quality of Life Score" value={`${data.recommendations.qualityOfLifeScore}/10`} valueColor="text-blue-700" subtext="Based on all factors" />
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-5 border-2 border-green-300 mb-6 shadow">
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-green-600" />
                        Your Salary Breakdown: {currencyFormatter.format(data.salaryBreakdown.yearly)}/year
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatCard label="Hourly Rate" value={currencyFormatter.format(data.salaryBreakdown.hourly)} valueColor="text-green-700" subtext="per hour"/>
                        <StatCard label="Weekly" value={currencyFormatter.format(data.salaryBreakdown.weekly)} valueColor="text-green-700" />
                        <StatCard label="Biweekly" value={currencyFormatter.format(data.salaryBreakdown.biweekly)} valueColor="text-green-700" />
                        <StatCard label="Monthly" value={currencyFormatter.format(data.salaryBreakdown.monthly)} valueColor="text-green-700" />
                    </div>
                </div>
                
                <div className="bg-white rounded-lg p-5 shadow">
                    <h4 className="font-bold text-gray-800 mb-3">💡 Negotiation Strategies:</h4>
                    <ul className="space-y-2">
                        {data.recommendations.negotiationStrategies.map((strat, i) => (
                             <li key={i} className="flex items-start gap-3 text-gray-700">
                                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>{strat}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        </div>
    );
};