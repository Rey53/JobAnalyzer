import React, { useState } from 'react';
import type { AnalysisData } from '../../types';
import { Lock, Unlock, ShieldCheck, AlertTriangle, TrendingUp, CheckCircle, XCircle, BookOpen, Award, Clock, DollarSign, ExternalLink, Target } from 'lucide-react';

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

    const getMatchColor = (match: number) => {
        if (match >= 80) return 'text-green-600 bg-green-100';
        if (match >= 60) return 'text-yellow-600 bg-yellow-100';
        return 'text-red-600 bg-red-100';
    };

    const getPriorityBadge = (priority: string) => {
        const colors = {
            Critical: 'bg-red-100 text-red-700 border-red-300',
            High: 'bg-orange-100 text-orange-700 border-orange-300',
            Medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
        };
        return colors[priority as keyof typeof colors] || colors.Medium;
    };

    return (
        <div className={`space-y-8 p-6 ${forceUnlock ? '' : 'animate-in fade-in slide-in-from-bottom-4 duration-500'}`}>
             <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-xl shadow-lg border-l-8 border-yellow-500">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <ShieldCheck className="w-10 h-10 text-yellow-400" />
                        <div>
                            <h2 className="text-xl font-bold">Confidential Recruiter Audit: Profile vs. Job Strategy</h2>
                            <p className="text-slate-300 text-sm">Critical gaps and alignment assessment for the Puerto Rico pharma sector.</p>
                        </div>
                    </div>
                    {data.cvEvaluation.overallMatch !== undefined && (
                        <div className={`px-6 py-4 rounded-xl font-black text-3xl ${getMatchColor(data.cvEvaluation.overallMatch)}`}>
                            {data.cvEvaluation.overallMatch}%
                            <div className="text-xs font-normal mt-1">Match Score</div>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 font-serif">
                {/* Strengths */}
                <div className="bg-white p-6 rounded-xl border-t-4 border-green-500 shadow-md">
                    <h3 className="text-lg font-black text-slate-950 mb-4 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        Key Competitive Strengths
                    </h3>
                    <ul className="space-y-3">
                        {(Array.isArray(data.cvEvaluation.strengths) ? data.cvEvaluation.strengths : []).map((item, index) => (
                            <li key={index} className="flex items-start gap-3 text-sm font-bold text-slate-900 bg-green-50 p-3 rounded-lg">
                                <span className="font-black text-green-600 min-w-[20px]">{index + 1}.</span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Weaknesses */}
                <div className="bg-white p-6 rounded-xl border-t-4 border-red-500 shadow-md">
                    <h3 className="text-lg font-black text-slate-950 mb-4 flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-red-600" />
                        Critical Gaps & Risks
                    </h3>
                    <ul className="space-y-3">
                        {(Array.isArray(data.cvEvaluation.weaknesses) ? data.cvEvaluation.weaknesses : []).map((item, index) => (
                            <li key={index} className="flex items-start gap-3 text-sm font-bold text-slate-900 bg-red-50 p-3 rounded-lg">
                                <span className="font-black text-red-600 min-w-[20px]">{index + 1}.</span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Skill Gaps */}
            {data.cvEvaluation.skillGaps && data.cvEvaluation.skillGaps.length > 0 && (
                <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-orange-500">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Target className="w-6 h-6 text-orange-600" />
                        Detailed Skill Gap Analysis
                    </h3>
                    <div className="space-y-4">
                        {data.cvEvaluation.skillGaps.map((gap, index) => (
                            <div key={index} className="bg-gradient-to-r from-gray-50 to-white p-5 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h4 className="font-bold text-lg text-gray-800">{gap.skill}</h4>
                                        <div className="flex gap-3 mt-2 text-sm">
                                            <span className="text-gray-600">Current: <span className="font-semibold text-red-600">{gap.currentLevel}</span></span>
                                            <span className="text-gray-400">→</span>
                                            <span className="text-gray-600">Required: <span className="font-semibold text-green-600">{gap.requiredLevel}</span></span>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getPriorityBadge(gap.priority)}`}>
                                        {gap.priority}
                                    </span>
                                </div>
                                <div className="mt-3">
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Learning Path:</p>
                                    <ol className="space-y-1 text-sm text-gray-700">
                                        {gap.learningPath.map((step, idx) => (
                                            <li key={idx} className="flex items-start gap-2">
                                                <span className="text-blue-600 font-bold">{idx + 1}.</span>
                                                {step}
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Learning Resources */}
            {data.cvEvaluation.learningResources && data.cvEvaluation.learningResources.length > 0 && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200 shadow-lg">
                    <h3 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2">
                        <BookOpen className="w-6 h-6 text-blue-600" />
                        Recommended Learning Resources
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        {data.cvEvaluation.learningResources.map((resource, index) => (
                            <div key={index} className="bg-white p-5 rounded-lg shadow-sm border border-blue-100 hover:shadow-md transition-all">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-800">{resource.title}</h4>
                                        <p className="text-sm text-gray-600 mt-1">{resource.provider}</p>
                                    </div>
                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                                        {resource.type}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        {resource.duration}
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <DollarSign className="w-4 h-4 text-gray-400" />
                                        {resource.cost}
                                    </div>
                                </div>
                                {resource.url && (
                                    <a 
                                        href={resource.url.startsWith('http') ? resource.url : `https://www.google.com/search?q=${encodeURIComponent(resource.url.replace('Search: ', ''))}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-3 flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        {resource.url.startsWith('http') ? 'Visit Resource' : 'Search Online'}
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Improvement Plan with Timeline */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-xl border border-purple-100 shadow-inner">
                 <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-purple-900 flex items-center gap-2">
                        <TrendingUp className="w-6 h-6 text-purple-600" />
                        Strategic Improvement Plan
                    </h3>
                    {data.cvEvaluation.timeline && (
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-purple-200">
                            <Award className="w-5 h-5 text-purple-600" />
                            <span className="font-bold text-purple-800">{data.cvEvaluation.timeline}</span>
                        </div>
                    )}
                </div>
                <div className="grid gap-4">
                    {(Array.isArray(data.cvEvaluation.improvementPlan) ? data.cvEvaluation.improvementPlan : []).map((item, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-purple-100 flex items-start gap-4 hover:shadow-md transition-shadow">
                             <div className="bg-purple-100 text-purple-700 font-black w-8 h-8 rounded-full flex items-center justify-center shrink-0">
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
