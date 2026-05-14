import React, { useState, useMemo } from 'react';
import { TrendingUp, Award, MapPin, Search } from 'lucide-react';
import { jobTitles } from '../../constants';

// Seniority multipliers
const SENIORITY_DATA = {
    'Junior (0-2 years)': { mult: 0.8, bonus: 2500 },
    'Mid-Level (3-7 years)': { mult: 1.0, bonus: 5000 },
    'Senior (8+ years)': { mult: 1.35, bonus: 10000 },
    'Principal/Director': { mult: 1.75, bonus: 20000 }
};

export const BenchmarkView: React.FC = () => {
    const [selectedRole, setSelectedRole] = useState(jobTitles[0]);
    const [selectedSeniority, setSelectedSeniority] = useState('Mid-Level (3-7 years)');

    // Dynamic calculation based on PR Market Data
    const metrics = useMemo(() => {
        // Base median across all pharma roles in PR
        const baseMedian = 78000;
        
        // Role-based adjustment (Simulated intelligence)
        let roleMultiplier = 1.0;
        if (selectedRole.includes('Engineer')) roleMultiplier = 1.15;
        if (selectedRole.includes('Manager')) roleMultiplier = 1.3;
        if (selectedRole.includes('Specialist')) roleMultiplier = 0.95;
        if (selectedRole.includes('Technician')) roleMultiplier = 0.7;

        const seniority = SENIORITY_DATA[selectedSeniority as keyof typeof SENIORITY_DATA];
        
        const median = baseMedian * roleMultiplier * seniority.mult;
        const low = median * 0.82;
        const high = median * 1.25;

        return {
            annual: {
                low: Math.round(low / 500) * 500,
                median: Math.round(median / 500) * 500,
                high: Math.round(high / 500) * 500
            },
            hourly: {
                low: (low / 2080).toFixed(2),
                median: (median / 2080).toFixed(2),
                high: (high / 2080).toFixed(2)
            },
            bonus: seniority.bonus
        };
    }, [selectedRole, selectedSeniority]);

    return (
        <div className="p-8">
            <div className="flex items-center gap-3 mb-8">
                <TrendingUp className="w-8 h-8 text-blue-600" />
                <h2 className="text-3xl font-black text-slate-900">PR Pharma Salary Benchmarks</h2>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Search & Filter */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Search className="w-4 h-4" /> Filter Market Data
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Job Role</label>
                                <select 
                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                >
                                    {jobTitles.map(title => <option key={title} value={title}>{title}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Seniority</label>
                                <select 
                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    value={selectedSeniority}
                                    onChange={(e) => setSelectedSeniority(e.target.value)}
                                >
                                    {Object.keys(SENIORITY_DATA).map(lvl => (
                                        <option key={lvl} value={lvl}>{lvl}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-blue-600 p-6 rounded-xl text-white shadow-lg">
                        <Award className="w-8 h-8 mb-4 text-blue-200" />
                        <h4 className="font-bold text-xl mb-2">Recruiter Insight</h4>
                        <p className="text-blue-100 text-sm">
                            Tier 1 companies (Amgen, AbbVie) typically pay 15-22% above these base benchmarks due to specialized GAMP5 requirements.
                        </p>
                    </div>
                </div>

                {/* Data Display */}
                <div className="lg:col-span-2">
                    <div className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Metric</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Low (25th)</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Median</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">High (75th)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                <tr>
                                    <td className="px-6 py-4 font-semibold text-slate-700">Annual Base</td>
                                    <td className="px-6 py-4 text-slate-600">${metrics.annual.low.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-blue-600 font-bold">${metrics.annual.median.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-slate-600">${metrics.annual.high.toLocaleString()}</td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 font-semibold text-slate-700">Hourly Rate</td>
                                    <td className="px-6 py-4 text-slate-600">${metrics.hourly.low}</td>
                                    <td className="px-6 py-4 text-slate-600 font-bold">${metrics.hourly.median}</td>
                                    <td className="px-6 py-4 text-slate-600">${metrics.hourly.high}</td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 font-semibold text-slate-700">Sign-on Bonus</td>
                                    <td className="px-6 py-4 text-slate-600 text-xs">Simulated min</td>
                                    <td className="px-6 py-4 text-slate-600 font-bold">${metrics.bonus.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-slate-600 text-xs text-right">Site specific</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-8 flex items-start gap-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                        <MapPin className="w-6 h-6 text-orange-500 shrink-0 mt-1" />
                        <div>
                            <h5 className="font-bold text-orange-800">Regional Variance</h5>
                            <p className="text-orange-700 text-sm">
                                Roles based in San Juan/Guaynabo (Metro) carry a 7% cost-of-living premium compared to roles in the Southern hub (Ponce/Juana Díaz).
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
