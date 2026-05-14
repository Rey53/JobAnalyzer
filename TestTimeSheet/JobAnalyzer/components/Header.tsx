import React from 'react';
import { LogOut } from 'lucide-react';
import { logout, getCurrentUser } from '../utils/auth';

export const Header: React.FC = () => {
    const linkedInLogo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAIaSURBVFhH7ZfNTuNAEIb/wQMKRAyIGB2xISFGTEgMXvB/ABJbLAgJ1YQEK2LEiBAbsscuu33Z3Zn5ZGc/kO1kSTszO/O2OzM7s1y8e/c+8IvsS2g1fJc4i/h+PzO8T5+k0P/gN4SgCMvT49I1mZ0c2b29/c0QoE31f+1CgJ4v1q5v/8LwA8sSgC8rLwA4P3kKQCgBCCtPjgC4BIAKQCgBMC1AEYAHAmAnAD+SADkAFwJQJcAHApwJAAaASgE4CjAlQA4EIAuAZQC8CBAuQB2BKAJgEcAkgK4I4A7ArgcgAsBLAKQCmBBAFcExoMAHAiQCgA4EHAmgKMAHAgAKcBZAJ4E4EqAYwFIAXAmgEcA1gKQBODiAqwJABYAJAE4EgA/AZAEcCUAnwKcgwYcCUAGYFwAFgIgA/BKAHYEsCgARwKgA/BNAHcEsCeAWABEArggQCsAnwLcCGAiQCsApwKcCWAsgB0BXAzA3QA8A0A/AM8A6AFwJgCLAPQAeAZgTgAWAagDcCaA3gBMAgAHYCqARwI8AmBNAN4E4CgARwJ4IoDjAI4A4AHwIICbANwJ4DGAHAG+BOBNABcA/AvgKIBFAHwKsCqARQDcBPAFwKMAvghwIICrAIAC/BvgXgDBxLgDeCgAJwI8E4CjABwJ4EkA5wLQCfD/AXYEUCgAxwLQCuBNgDsCGA2gFIBf/D5v23bd/f8B/V1pBJA5WfAAAAAASUVORKCYII=';
    const currentUser = getCurrentUser();

    const handleLogout = () => {
        if (confirm('Are you sure you want to logout?')) {
            logout();
        }
    };

    return (
        <header className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-6 rounded-t-2xl shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-flask-conical"><path d="M10 2v7.31"/><path d="M14 9.31V2"/><path d="M4 10.94V21h16v-10.06"/><path d="M10.49 14.49 4.49 21"/><path d="m13.51 14.49 6-6.01"/></svg>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">PharmaPacePR: Job Opportunity Analyzer</h1>
                        <p className="text-blue-200 mt-1">by <a href="https://www.servicioxpert.com" target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline">ServicioXpert.com</a></p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {currentUser && (
                        <span className="text-blue-100 text-sm hidden sm:block">👤 {currentUser}</span>
                    )}
                    <a href="https://www.linkedin.com/in/servicioxpert" target="_blank" rel="noopener noreferrer" className="flex-shrink-0 flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold px-4 py-2 rounded-lg transition-colors">
                        <img src={linkedInLogo} alt="LinkedIn Logo" className="w-5 h-5" />
                        <span className="hidden sm:inline">LinkedIn Connect</span>
                    </a>
                    <button
                        onClick={handleLogout}
                        className="flex-shrink-0 flex items-center gap-2 bg-red-500/80 hover:bg-red-600/90 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                        title="Logout"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
            </div>
             <p className="text-blue-200 mt-4 flex items-center gap-2 flex-wrap">
                <span>Empowering confident hiring decisions with AI analysis backed by real-time market data.</span>
                <span className="flex items-center gap-1.5 bg-green-500/90 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    <svg className="w-2 h-2 fill-current" viewBox="0 0 8 8">
                        <circle cx="4" cy="4" r="4" />
                    </svg>
                    LIVE DATA
                </span>
            </p>
        </header>
    );
};