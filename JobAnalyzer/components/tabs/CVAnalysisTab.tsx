import React, { useState } from 'react';
import type { AnalysisData } from '../../types';
import { Lock, Unlock, ShieldCheck, AlertTriangle, TrendingUp, CheckCircle, XCircle } from 'lucide-react';

interface TabProps {
    data: AnalysisData;
    forceUnlock?: boolean;
}

export const CVAnalysisTab: React.FC<TabProps> = ({ data, forceUnlock = false }) => {
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleUnlock = (e: React.FormEvent) => {
        e.preventDefault();
        // Simple hardcoded password for now as requested
        if (password === 'Pharma2026') {
            setIsUnlocked(true);
            setError('');
        } else {
            setError('Invalid Access Code');
        }
    };

    if (!isUnlocked && !forceUnlock) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-xl border-2 border-slate-200">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center space-y-6">
                    <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                        <Lock className="w-8 h-8 text-red-600" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-800 uppercase tracking-widest">Confidential Analysis</h3>
                        <p className="text-sm text-slate-500 mt-2">This section contains sensitive recruiter feedback and critical CV gaps.</p>
                    </div>
                    
                    <form onSubmit={handleUnlock} className="space-y-4">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter Access Code"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-center text-lg tracking-widest"
                        />
                        {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
                        <button
                            type="submit"
                            className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                        >
                            <Unlock className="w-4 h-4" />
                            Unlock Report
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    if (!data.cvEvaluation) {
        return (
            <div className="text-center py-12 text-slate-500">
                <p>No CV analysis data available. Please re-run the analysis.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-xl shadow-lg border-l-8 border-yellow-500">
                <div className="flex items-center gap-4">
                    <ShieldCheck className="w-10 h-10 text-yellow-400" />
                    <div>
                        <h2 className="text-xl font-bold">Expert CV Critique & Gap Analysis</h2>
                        <p className="text-slate-300 text-sm">Confidential assessment of your profile against the job description.</p>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Strengths */}
                <div className="bg-white p-6 rounded-xl border-t-4 border-green-500 shadow-md">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        Key Competitive Strengths
                    </h3>
                    <ul className="space-y-3">
                        {(Array.isArray(data.cvEvaluation.strengths) ? data.cvEvaluation.strengths : []).map((item, index) => (
                            <li key={index} className="flex items-start gap-3 text-sm text-gray-700 bg-green-50 p-3 rounded-lg">
                                <span className="font-bold text-green-600 min-w-[20px]">{index + 1}.</span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Weaknesses */}
                <div className="bg-white p-6 rounded-xl border-t-4 border-red-500 shadow-md">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-red-600" />
                        Critical Gaps & Risks
                    </h3>
                    <ul className="space-y-3">
                        {(Array.isArray(data.cvEvaluation.weaknesses) ? data.cvEvaluation.weaknesses : []).map((item, index) => (
                            <li key={index} className="flex items-start gap-3 text-sm text-gray-700 bg-red-50 p-3 rounded-lg">
                                <span className="font-bold text-red-600 min-w-[20px]">{index + 1}.</span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Improvement Plan */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-xl border border-blue-100 shadow-inner">
                 <h3 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                    Strategic Improvement Plan
                </h3>
                <div className="grid gap-4">
                    {(Array.isArray(data.cvEvaluation.improvementPlan) ? data.cvEvaluation.improvementPlan : []).map((item, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-blue-100 flex items-start gap-4 hover:shadow-md transition-shadow">
                             <div className="bg-blue-100 text-blue-700 font-black w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                                {index + 1}
                             </div>
                             <p className="text-gray-700 font-medium pt-1">{item}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
