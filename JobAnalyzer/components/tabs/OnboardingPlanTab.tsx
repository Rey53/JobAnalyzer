
import React from 'react';
import type { AnalysisData } from '../../types';
import { CalendarCheck, Check } from 'lucide-react';

interface TabProps {
    data: AnalysisData;
}

const OnboardingPhaseCard: React.FC<{ phase: string; title: string; tasks: string[]; isLast?: boolean }> = ({ phase, title, tasks, isLast = false }) => (
    <div className="relative pl-24">
        <div className="absolute left-0 top-0 flex flex-col items-center h-full">
            <div className="flex-shrink-0 bg-green-500 text-white font-bold rounded-full w-16 h-16 flex items-center justify-center text-xl z-10 border-4 border-white">
                {phase}
            </div>
            {!isLast && <div className="w-1 flex-grow bg-green-200"></div>}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <h4 className="font-bold text-lg text-gray-800 mb-2">{title}</h4>
            <ul className="space-y-2">
                {tasks.map((task, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-700">
                        <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{task}</span>
                    </li>
                ))}
            </ul>
        </div>
    </div>
);


export const OnboardingPlanTab: React.FC<TabProps> = ({ data }) => {
    const { days30, days60, days90 } = data.onboardingPlan;
    return (
        <div className="space-y-6">
            <section className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <CalendarCheck className="w-6 h-6 text-green-600" />
                    Sample 30-60-90 Day Onboarding Plan
                </h3>
                <p className="text-gray-600 mb-6">Use this plan as a guide to hit the ground running and make a strong impact in your new role.</p>

                <div className="space-y-0">
                   <OnboardingPhaseCard phase="30" title={days30.title} tasks={days30.tasks} />
                   <OnboardingPhaseCard phase="60" title={days60.title} tasks={days60.tasks} />
                   <OnboardingPhaseCard phase="90" title={days90.title} tasks={days90.tasks} isLast={true} />
                </div>
            </section>
        </div>
    );
};
