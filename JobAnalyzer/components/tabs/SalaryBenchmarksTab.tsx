
import React from 'react';
import type { AnalysisData } from '../../types';
import { Briefcase, FileText, Plus, Minus, Star, Award, TrendingUp } from 'lucide-react';

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
    const recommendedHourly = data.recommendations.idealSalary / 2080;
    const { candidateFitScore } = data.recommendations;
    const { compensationComparison } = data;

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
                        value={currencyFormatter.format(data.recommendations.idealSalary)}
                        subtext="For comfortable living & growth"
                        icon={<TrendingUp size={24}/>}
                        color="#16a34a" // green-600
                    />
                     <ScoreboardCard 
                        title="Recommended Hourly Rate"
                        value={`${currencyFormatterHourly.format(recommendedHourly)}`}
                        subtext="Based on 2,080 hours/year"
                        icon={<TrendingUp size={24}/>}
                        color="#16a34a" // green-600
                    />
                    <ScoreboardCard 
                        title="Candidate Fit Score"
                        value={`${candidateFitScore.score}/10`}
                        subtext={candidateFitScore.summary}
                        icon={<Star size={24} />}
                        color="#ca8a04" // yellow-600
                    >
                         <div className="flex items-center justify-center -ml-4 -mt-2">
                            <ScoreGauge score={candidateFitScore.score} />
                        </div>
                    </ScoreboardCard>
                </div>
            </section>
            
            {/* Industry Salary Ranges */}
            <section className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Briefcase className="w-6 h-6 text-indigo-600" />
                    Industry Salary Ranges (Puerto Rico)
                </h3>
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="w-full text-sm text-left text-gray-700">
                        <thead className="text-xs text-gray-800 uppercase bg-gray-100">
                            <tr>
                                <th scope="col" className="px-6 py-3">Role</th>
                                <th scope="col" className="px-6 py-3">Junior Level</th>
                                <th scope="col" className="px-6 py-3">Mid-Level</th>
                                <th scope="col" className="px-6 py-3">Senior Level</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.salaryBenchmarks.map((benchmark) => (
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
            </section>

            {/* Compensation Comparison */}
            <section className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-6 border-2 border-teal-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FileText className="w-6 h-6 text-teal-600" />
                    Employment Type Comparison
                </h3>
                <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    <CompensationCard 
                        title="W2 Employee Offer"
                        salary={compensationComparison.w2Salary}
                        color="#2563eb" // blue-600
                        pros={[
                            "Employer pays half of FICA taxes",
                            "Access to subsidized benefits",
                            "Paid time off & holidays",
                        ]}
                        cons={[]}
                    />
                     <CompensationCard 
                        title="Equivalent 1099 Contractor"
                        salary={compensationComparison.equivalent1099Salary}
                        color="#d97706" // amber-600
                        pros={[
                            "More flexibility & autonomy",
                            "Potential for more deductions",
                        ]}
                        cons={[
                            {label: "Self-Employment Tax", value: compensationComparison.explanation1099.selfEmploymentTax},
                            {label: "Benefits Costs", value: compensationComparison.explanation1099.benefitsCost},
                            {label: "Total Annual Difference", value: compensationComparison.explanation1099.totalDifference},
                        ]}
                    />
                      <CompensationCard 
                        title="Equivalent Form 480 Services"
                        salary={compensationComparison.equivalent480Salary}
                        color="#0d9488" // teal-600
                        pros={[
                           "Fixed tax withholding option",
                           "Common in PR professional services",
                        ]}
                        cons={[
                            {label: "Tax Withholding", value: compensationComparison.explanation480.taxWithholding},
                            {label: "Benefits Costs", value: compensationComparison.explanation480.benefitsCost},
                            {label: "Total Annual Difference", value: compensationComparison.explanation480.totalDifference},
                        ]}
                    />
                </div>
            </section>
        </div>
    );
};
